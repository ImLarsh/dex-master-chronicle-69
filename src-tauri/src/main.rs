// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, SystemTray, SystemTrayMenu, SystemTrayEvent, Manager};
use std::fs;
use std::path::PathBuf;

#[tauri::command]
fn save_pokemon_data(app_handle: tauri::AppHandle, data: String) -> Result<(), String> {
    let app_dir = app_handle.path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;
    
    fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    
    let file_path = app_dir.join("pokemon_cache.json");
    fs::write(file_path, data).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn load_pokemon_data(app_handle: tauri::AppHandle) -> Result<String, String> {
    let app_dir = app_handle.path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;
    
    let file_path = app_dir.join("pokemon_cache.json");
    
    if file_path.exists() {
        fs::read_to_string(file_path).map_err(|e| e.to_string())
    } else {
        Ok(String::new())
    }
}

#[tauri::command]
fn save_favorites(app_handle: tauri::AppHandle, favorites: String) -> Result<(), String> {
    let app_dir = app_handle.path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;
    
    fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
    
    let file_path = app_dir.join("favorites.json");
    fs::write(file_path, favorites).map_err(|e| e.to_string())?;
    
    Ok(())
}

#[tauri::command]
fn load_favorites(app_handle: tauri::AppHandle) -> Result<String, String> {
    let app_dir = app_handle.path_resolver()
        .app_data_dir()
        .ok_or("Failed to get app data directory")?;
    
    let file_path = app_dir.join("favorites.json");
    
    if file_path.exists() {
        fs::read_to_string(file_path).map_err(|e| e.to_string())
    } else {
        Ok("[]".to_string())
    }
}

fn main() {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit Pokédex");
    let show = CustomMenuItem::new("show".to_string(), "Show Pokédex");
    let tray_menu = SystemTrayMenu::new()
        .add_item(show)
        .add_item(quit);

    let system_tray = SystemTray::new()
        .with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "show" => {
                        let window = app.get_window("main").unwrap();
                        window.show().unwrap();
                        window.set_focus().unwrap();
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            save_pokemon_data,
            load_pokemon_data,
            save_favorites,
            load_favorites
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}