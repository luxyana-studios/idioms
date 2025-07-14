# Componentes de Reporte - Sistema Optimizado

## 📋 Componentes Principales

### **ReportModal.tsx**

Modal principal para reportes generales de la app. Maneja diferentes tipos de reportes con flujos simples y complejos.

**Tipos de reporte:**

- ⚡ **Directos**: Grammar/Spelling Error, Display Problem, App is Slow, Data Not Saving
- 📝 **Con texto**: Suggest a Feature, Other Issue
- 🔍 **Detallados**: Translation Error, App Bug/Crash (abren ReportForm)

### **ReportForm.tsx**

Formulario detallado para reportes complejos que requieren información específica.

**Tipos soportados:**

- `translation-issue`: Errores de traducción específicos
- `app-issue`: Bugs y crashes de la aplicación

---

## 🧩 Componentes Reutilizables

### **ModalContainer.tsx**

Contenedor base para todos los modales con:

- Backdrop con dismiss automático
- Animaciones con Moti
- Ajuste automático para teclado
- Shadows y estilos consistentes

```tsx
<ModalContainer
  isVisible={visible}
  onClose={handleClose}
  keyboardAdjustment={{ translateY: -120, maxHeight: '70%' }}
>
  {/* Contenido */}
</ModalContainer>
```

### **FormField.tsx**

Campo de entrada reutilizable con:

- Labels consistentes
- Estilos unificados
- Soporte para multiline
- Indicador de requerido

```tsx
<FormField
  label="Description"
  value={value}
  onChangeText={setValue}
  placeholder="Enter description..."
  multiline
  required
/>
```

### **ActionButtons.tsx**

Botones de acción estandarizados:

- Cancel/Submit layout consistente
- Estilos unificados
- Estados disabled
- Textos customizables

```tsx
<ActionButtons
  onCancel={handleCancel}
  onSubmit={handleSubmit}
  submitText="Send Report"
/>
```

---

## 🎣 Hooks Personalizados

### **useKeyboardDetection.ts**

Hook para detectar visibilidad del teclado:

```tsx
const keyboardVisible = useKeyboardDetection();
```

### **useFormState.ts**

Hook para gestión de estado de formularios:

```tsx
const form = useFormState({ description: '', title: '' });
// form.values, form.setValue, form.reset, form.getField
```

---

## 🛠 Utilidades

### **formValidation.ts**

Funciones de validación centralizadas:

- `validateRequired(value, fieldName)`
- `validateDescription(description)`
- `validateText(text, context)`
- `createReportData(type, description, additionalFields)`

### **modalStyles.ts**

Estilos compartidos para todos los modales:

- Colores adaptativos al tema
- Shadows y bordes consistentes
- Layout responsivo

---

## 🔄 Flujo de Uso

1. **Usuario abre ReportModal** desde el perfil
2. **Selecciona tipo de reporte:**
   - **Directos**: Se envían inmediatamente
   - **Con texto**: Muestran input en el modal
   - **Detallados**: Abren ReportForm
3. **ReportForm** maneja casos complejos con múltiples campos
4. **Validación** y **envío** usando utilidades centralizadas

---

## ✨ Ventajas del Sistema

- **🔧 Mantenible**: Cambios en un lugar afectan todo
- **🎨 Consistente**: Misma UX en todos los reportes
- **📈 Escalable**: Fácil agregar nuevos tipos
- **🧪 Testeable**: Componentes pequeños y enfocados
- **♻️ Reutilizable**: Componentes usables en toda la app

---

## 📱 Compatibilidad

- ✅ iOS
- ✅ Android
- ✅ Tema claro/oscuro
- ✅ Diferentes tamaños de pantalla
- ✅ Ajuste automático de teclado
