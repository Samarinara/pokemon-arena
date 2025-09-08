use std::fs;
use std::error::Error;

pub fn load_json(file_path: &str) -> Result<String, Box<dyn Error>> {
    let data = fs::read_to_string(file_path)?;
    Ok(data)
}
