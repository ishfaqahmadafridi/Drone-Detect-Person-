# 🏪 Folder Guide: `frontend/src/store/`

## 🎯 What this folder does (Simple Words)
This folder holds the **Redux Global State Store**.

It stores global application state that multiple components across the entire screen need to read and modify at the same time — such as the current threat level, active camera ID, viewport layout mode (1-UP vs 2-UP), and selected suspect portraits.

---

## 🛠️ Technologies & Libraries Used
- **Redux Toolkit (`@reduxjs/toolkit`)**: Standard, efficient state management library for React.
- **React-Redux (`react-redux`)**: Typed hooks (`useAppSelector`, `useAppDispatch`) for accessing global store state safely.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `index.ts` | Configures the Redux store and exports strongly-typed `useAppSelector` and `useAppDispatch` hooks. |
| `slices/telemetrySlice.ts` | Manages live sensor telemetry, active perspective (`aerial` vs `ground`), connected camera IDs, viewport layout mode (`single`, `dual`, `quad`), and active model names. |
| `slices/uiSlice.ts` | Controls UI modals, suspect portraits, camera wall visibility, audio mute toggles, and sidebar collapse states. |
| `slices/configSlice.ts` | Holds dynamic AI confidence thresholds, IOU ratios, and restricted zone polygon vertices. |
