# Guía de Pruebas con Mocking en RegisterUserUseCase

## Introducción

En las pruebas unitarias, es crucial asegurarse de que las pruebas sean rápidas, confiables y no dependan de servicios externos. El _mocking_ es una técnica utilizada para reemplazar componentes reales con versiones simuladas durante las pruebas. Esto te permite controlar el comportamiento del componente simulado y verificar cómo interactúa tu código con él sin ejecutar el código real.

## ¿Qué es el Mocking?

El mocking reemplaza los componentes reales con versiones simuladas (mocks) que devuelven resultados predefinidos. Esto te ayuda a probar tu lógica sin tener que interactuar con servicios externos, como bases de datos o APIs.

## Configuración del Mocking

Para configurar el mocking en tus pruebas con Jest y NestJS, sigues estos pasos:

1. **Importa los Módulos Necesarios:**
   Asegúrate de importar los módulos necesarios para tus pruebas, como `Test` y `TestingModule` de `@nestjs/testing`.

2. **Reemplaza los Métodos Reales con Mocks:**
   Usa `jest.spyOn` para reemplazar métodos reales con versiones simuladas. Por ejemplo:

   ```typescript
   jest
     .spyOn(firebaseService, "createUserAuth")
     .mockResolvedValue({ uid: "test-uid" } as any);
   ```

Aquí, createUserAuth se reemplaza por un mock que devuelve un objeto simulado con un uid ficticio.

## Verifica los Resultados:

Asegúrate de que el método simulado sea llamado con los parámetros correctos y que tu lógica maneje el resultado esperado. Por ejemplo:

```typescript
expect(firebaseService.createUserAuth).toHaveBeenCalledWith(expect.any(User));
```

## ¿Por Qué Usar Mocking?

Pruebas Rápidas y Aisladas:
Las pruebas unitarias con mocks son rápidas porque no dependen de servicios externos. Esto asegura que tus pruebas sean consistentes y no se vean afectadas por cambios externos.

## Seguridad:

El mocking evita que tus pruebas modifiquen datos reales en tu base de datos, evitando cambios inesperados o la creación de datos de prueba no deseados.

## Ejemplo de Mocking

Supongamos que tienes un FirebaseService que interactúa con Firebase para crear un usuario. Durante las pruebas, puedes reemplazar la función real createUserAuth con un mock que devuelve un valor predefinido:

en el test:

```typescript
await expect(useCase.execute(validUserDto)).resolves.toEqual(
  "Usuario registrado correctamente",
);
expect(firebaseService.createUserAuth).toHaveBeenCalledWith({
  email: validUser.email,
  password: validUser.password,
});
```
