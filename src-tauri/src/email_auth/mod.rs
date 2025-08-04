use reqwest::blocking::Client;
use serde::Serialize;
use rand::Rng;
use crate::pokemon::{pokemon_indexer};

pub fn send_verification_email(email: &str) -> Result<(), String> {
    println!("Sending verification email to {}", email);
    match send_email_to_server(email, "https://pokemon-arena.thescandalsthatwere.com/verify_email") {
        Ok(_) => {println!("Email sent successfully."); return Ok(())},
        Err(e) => {eprintln!("Failed to send email: {}", e); return Err(e)},
    }
}

#[derive(Serialize)]
struct EmailPayload<'a> {
    email: &'a str,
    key: &'a str,
}

fn send_email_to_server(email: &str, server_url: &str) -> Result<(), String> {
    let key = generate_key();
    println!("Generated key for {}: {}", email, key);
    let payload = EmailPayload { email, key: &key };
    let client = Client::new();
    let response = client.post(server_url)
        .json(&payload)
        .send().map_err(|e| e.to_string())?;  // blocking call, no await needed
    println!("Email sent to {}", email);
    
    match response.status().as_str()  {
        "200" => { println!("Email sent successfully."); return Ok(())},
        _ => { println!("Failed to send email. Status: {}", response.status()); return Err(response.text().unwrap());}
    }
}  

fn generate_key() -> String {
    let mut rng = rand::thread_rng();
    let number = rng.gen_range(0..151);
    let pkmn = pokemon_indexer::get_pokemon_by_number(number);

    let mut rng2 = rand::thread_rng();
    let number2 = rng2.gen_range(0..151);
    let pkmn2 = pokemon_indexer::get_pokemon_by_number(number2);

    let mut rng3 = rand::thread_rng();
    let number3 = rng3.gen_range(0..151);
    let pkmn3 = pokemon_indexer::get_pokemon_by_number(number3);

    return (pkmn + " " + &pkmn2 + " " + &pkmn3).to_string()
}

#[derive(Serialize)]
struct VerifyPayload<'a> {
    email: &'a str,
    key: &'a str,
}

pub fn verify_key(email: &str, key: &str) -> Result<bool, String> {
    println!("Verifying key for {}: {}", email, key);
    let payload = VerifyPayload { email, key };
    let client = Client::new();
    let response = client.post("https://pokemon-arena.thescandalsthatwere.com/verify_email")
        .json(&payload)
        .send()
        .map_err(|e| e.to_string())?;

    let status = response.status();
    let text = response.text().unwrap_or_else(|_| "<no response text>".to_string());
    println!("Verification response: status = {}, text = {}", status, text);

    if status.is_success() {
        Ok(true)
    } else {
        Ok(false)
    }
}
