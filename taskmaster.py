import streamlit as st
import json
import os
import base64

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

def apply_board_background(image_bytes):
    encoded_image = base64.b64encode(image_bytes).decode()
    st.markdown(
        f"""
        <style>
        .stApp {{
            background-image: url("data:image/png;base64,{encoded_image}");
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
        }}
        </style>
        """,
        unsafe_allow_html=True
    )

# --- 2. DATA PERSISTENCE ---
def load_tasks():
    if os.path.exists('kanban_data.json'):
        with open('kanban_data.json', 'r') as f:
            return json.load(f)
    return []

def save_tasks(tasks):
    with open('kanban_data.json', 'w') as f:
        json.dump(tasks, f, indent=4)

if 'tasks' not in st.session_state:
    st.session_state.tasks = load_tasks()
if 'board_background' not in st.session_state:
    st.session_state.board_background = None

# --- 3. INTERFACE: ADD TASK ---
title_col, modifiers_col = st.columns([4, 1])

with title_col:
    st.title("📋 TaskMaster: Your Kanban Board")

with modifiers_col:
    with st.expander("🎨 GUI Modifiers"):
        background_file = st.file_uploader(
            "Board background",
            type=["png", "jpg", "jpeg", "webp"],
            help="Upload an image from your computer to use as board background."
        )

        if background_file is not None:
            st.session_state.board_background = background_file.getvalue()

        if st.button("Remove background"):
            st.session_state.board_background = None
            st.rerun()

if st.session_state.board_background:
    apply_board_background(st.session_state.board_background)

with st.sidebar:
    st.header("➕ New Task")
    with st.form("task_form", clear_on_submit=True):
        title = st.text_input("What needs to be done?")
        priority = st.selectbox("Priority", ["High", "Medium", "Low"])
        submit = st.form_submit_button("Add to board")
        
        if submit and title:
            new_task = {
                "id": len(st.session_state.tasks), 
                "title": title, 
                "priority": priority, 
                "status": "Pending"
            }
            st.session_state.tasks.append(new_task)
            save_tasks(st.session_state.tasks)
            st.rerun()

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
            priority_class = f"priority-{task['priority'].lower()}"
            
            st.markdown(f"""
                <div class="task-card {priority_class}">
                    <strong>{task['title']}</strong><br>
                    <small>Priority: {task['priority']}</small>
                </div>
            """, unsafe_allow_html=True)
            
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
