import streamlit as st
import json
import os
import base64
from urllib.parse import quote

# --- 1. CONFIGURATION AND STYLE ---
st.set_page_config(page_title="TaskMaster Kanban", layout="wide", page_icon="📋")

st.markdown("""
    <style>
    /* Column header styles */
    .header-pending { 
        background-color: #ff6b6b; color: white; padding: 10px; border-radius: 8px; text-align: center; margin-bottom: 15px;
    }
    .header-progress { 
        background-color: #feca57; color: white; padding: 10px; border-radius: 8px; text-align: center; margin-bottom: 15px;
    }
    .header-finished { 
        background-color: #1dd1a1; color: white; padding: 10px; border-radius: 8px; text-align: center; margin-bottom: 15px;
    }
    
    /* Task card styles */
    .task-card {
        background-color: white;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        border-left: 5px solid #ccc;
        color: #2f3640;
    }
    
    /* Border colors based on priority */
    .priority-high { border-left-color: #ee5253; }
    .priority-medium { border-left-color: #ffd32a; }
    .priority-low { border-left-color: #10ac84; }
    
    /* Styling for the delete button specifically */
    button:contains("Delete") {
        color: #ff4b4b !important;
        border-color: #ff4b4b !important;
    }
    </style>
""", unsafe_allow_html=True)

# --- 2. DATA PERSISTENCE ---
def load_tasks():
    if os.path.exists('kanban_data.json'):
        with open('kanban_data.json', 'r') as f:
            return json.load(f)
    return []

def save_tasks(tasks):
    with open('kanban_data.json', 'w') as f:
        json.dump(tasks, f, indent=4)

def generate_checklist(description):
    text = (description or "").lower()
    if "api" in text:
        return ["Create endpoint", "Validate inputs", "Implement authentication", "Test API"]
    if "bug" in text or "fix" in text:
        return ["Reproduce issue", "Identify root cause", "Apply fix", "Run regression checks"]
    return ["Break work into subtasks", "Implement core changes", "Review and refine", "Run tests"]

def ensure_task_schema(task):
    task.setdefault("description", "")
    task.setdefault("checklist", generate_checklist(task.get("description", "") or task.get("title", "")))
    task.setdefault("checklist_state", [False for _ in task["checklist"]])

def csv_escape(value):
    return "\"" + str(value or "").replace("\"", "\"\"") + "\""

if 'tasks' not in st.session_state:
    st.session_state.tasks = load_tasks()
    for existing_task in st.session_state.tasks:
        ensure_task_schema(existing_task)
    save_tasks(st.session_state.tasks)

if "custom_background_data" not in st.session_state:
    st.session_state.custom_background_data = ""

# --- 3. INTERFACE: ADD TASK ---
st.title("📋 TaskMaster: Your Kanban Board")

with st.sidebar:
    st.header("➕ New Task")
    with st.form("task_form", clear_on_submit=True):
        title = st.text_input("What needs to be done?")
        description = st.text_area("Description")
        priority = st.selectbox("Priority", ["High", "Medium", "Low"])
        submit = st.form_submit_button("Add to board")
        
        if submit and title:
            auto_checklist = generate_checklist(description or title)
            new_task = {
                "id": len(st.session_state.tasks), 
                "title": title, 
                "description": description,
                "priority": priority, 
                "status": "Pending",
                "checklist": auto_checklist,
                "checklist_state": [False for _ in auto_checklist]
            }
            st.session_state.tasks.append(new_task)
            save_tasks(st.session_state.tasks)
            st.rerun()

    st.markdown("---")
    st.subheader("🎨 Board background")
    bg_file = st.file_uploader("Customize Background", type=["png", "jpg", "jpeg", "webp"], key="bg_upload")
    if bg_file is not None:
        file_bytes = bg_file.getvalue()
        mime_type = bg_file.type or "image/png"
        base64_data = base64.b64encode(file_bytes).decode("utf-8")
        st.session_state.custom_background_data = f"data:{mime_type};base64,{base64_data}"

    if st.button("Reset Background"):
        st.session_state.custom_background_data = ""

    st.markdown("---")
    st.subheader("📊 Backlog export")
    csv_lines = ["Title,Description,Priority,Status"]
    for t in st.session_state.tasks:
        ensure_task_schema(t)
        row = [
            csv_escape(t.get("title", "")),
            csv_escape(t.get("description", "")),
            csv_escape(t.get("priority", "")),
            csv_escape(t.get("status", ""))
        ]
        csv_lines.append(",".join(row))
    st.download_button(
        "Export Backlog",
        data="\n".join(csv_lines),
        file_name="taskmaster_backlog.csv",
        mime="text/csv"
    )

if st.session_state.custom_background_data:
    st.markdown(
        f"""
        <style>
        [data-testid="stAppViewContainer"] {{
            background-image: url('{st.session_state.custom_background_data}');
            background-size: cover;
            background-position: center;
        }}
        </style>
        """,
        unsafe_allow_html=True
    )

# --- 4. THE BOARD ---
col1, col2, col3 = st.columns(3)

workflow = [
    ("⏳ Pending", "Pending", col1, "Start →", "header-pending"),
    ("🚀 In Progress", "In Progress", col2, "Finish ✅", "header-progress"),
    ("🎯 Finished", "Finished", col3, "Delete 🔥", "header-finished"),
]

for col_name, status_id, column, btn_text, css_class in workflow:
    with column:
        st.markdown(f'<div class="{css_class}"><h3>{col_name}</h3></div>', unsafe_allow_html=True)
        
        # Filter tasks by status
        current_tasks = [t for t in st.session_state.tasks if t['status'] == status_id]
        
        for task in current_tasks:
            ensure_task_schema(task)
            priority_class = f"priority-{task['priority'].lower()}"
            
            st.markdown(f"""
                <div class="task-card {priority_class}">
                    <strong>{task['title']}</strong><br>
                    <small>Priority: {task['priority']}</small>
                </div>
            """, unsafe_allow_html=True)

            if task.get("description"):
                st.caption(f"Description: {task['description']}")

            calendar_url = (
                "https://calendar.google.com/calendar/render?action=TEMPLATE"
                f"&text={quote(task['title'])}"
                f"&details={quote(task.get('description', ''))}"
            )
            links_col1, links_col2 = st.columns(2)
            with links_col1:
                st.link_button("Add to Calendar", calendar_url, use_container_width=True)
            with links_col2:
                teams_summary = f"New Task: {task['title']} | Priority: {task['priority']}"
                teams_summary_safe = teams_summary.replace("'", "&#39;")
                teams_js = f"""
                <button style='width:100%;padding:0.45rem;border:1px solid #b9c2d8;border-radius:0.5rem;background:#f7f9ff;cursor:pointer;'
                    onclick="navigator.clipboard.writeText('{teams_summary_safe}');window.open('https://teams.microsoft.com','_blank');">
                    Share to Teams
                </button>
                """
                st.components.v1.html(teams_js, height=44)

            st.markdown("**Auto-generated checklist**")
            for idx, item in enumerate(task["checklist"]):
                check_key = f"check_{task['id']}_{status_id}_{idx}"
                checked_value = st.checkbox(item, value=task["checklist_state"][idx], key=check_key)
                if task["checklist_state"][idx] != checked_value:
                    task["checklist_state"][idx] = checked_value
                    save_tasks(st.session_state.tasks)
            
            if st.button(btn_text, key=f"btn_{task['id']}"):
                # STATE FLOW:
                if status_id == "Pending":
                    task['status'] = "In Progress"
                elif status_id == "In Progress":
                    task['status'] = "Finished"
                elif status_id == "Finished":
                    st.session_state.tasks.remove(task) # Permanent deletion
                
                save_tasks(st.session_state.tasks)
                st.rerun()
