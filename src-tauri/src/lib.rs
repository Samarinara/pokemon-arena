mod email_auth;
mod pokemon;


#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn send_verification_email(email: &str) -> Result<(), String> {
    println!("Sending verification email to {}", email);
    email_auth::send_verification_email(email)
}

#[tauri::command]
fn verify_key(email: &str, key: &str) -> Result<bool, String> {
    email_auth::verify_key(email, key)
}
 
#[tauri::command]
fn get_pokemon_by_number(number: i32) -> String {
    pokemon::pokemon_indexer::get_pokemon_by_number(number)
}

#[tauri::command]
fn get_pokemon_stat_block(name: &str) -> Option<pokemon::pokemon_indexer::PokemonStatBlock> {
    pokemon::pokemon_indexer::get_pokemon_stat_block(name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, send_verification_email, verify_key, get_pokemon_by_number, get_pokemon_stat_block])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
 