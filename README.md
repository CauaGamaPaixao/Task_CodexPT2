# 📋 TaskMaster

**TaskMaster** es un tablero de gestión de proyectos estilo Kanban diseñado para organizar tareas de forma visual y eficiente. Esta aplicación combina la potencia lógica de **Python** con la flexibilidad de **HTML/CSS** para ofrecer una experiencia de usuario fluida y profesional.

## 🚀 Características Principales

- **Tablero Dinámico**: Flujo de trabajo dividido en 4 columnas (Pendiente, En Proceso, Terminado y Archivado).
- **Priorización Visual**: Sistema de tarjetas con bordes de colores automáticos según la importancia (Alta, Media, Baja).
- **Interfaz Personalizada**: Uso de inyección de estilos CSS para mejorar la jerarquía visual y el contraste.
- **Persistencia de Datos**: Almacenamiento local automático mediante archivos JSON.
- **Ciclo de Vida de Tareas**: Desde la creación en el panel lateral hasta el borrado definitivo desde la papelera de reciclaje (Archivados).

## 🛠️ Tecnologías Utilizadas

- **Lenguaje:** Python 3.x
- **Framework Web:** Streamlit
- **Diseño:** HTML5 & CSS3 (Custom Styling)
- **Base de Datos:** JSON (Persistencia local)

## 🎨 Diseño Visual (UI)
La aplicación utiliza una paleta de colores pastel para facilitar la lectura:
- 🔴 **Rojo Coral:** Tareas Pendientes.
- 🟡 **Amarillo Girasol:** Tareas en Proceso.
- 🟢 **Verde Esmeralda:** Tareas Terminadas.

## ⚙️ Instalación y Uso

1. Instala Streamlit si aún no lo tienes:
   ```bash
   pip install streamlit
2 . Ejecuta la aplicación:
   ```bash
   streamlit run taskmaster.py
