#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env, String};

#[test]
fn test_create_event() {
    let env = Env::default();
    let contract_id = env.register(EventManager, ());
    let client = EventManagerClient::new(&env, &contract_id);

    let organizer = Address::generate(&env);
    
    env.mock_all_auths();

    let event_id = client.create_event(
        &organizer,
        &String::from_str(&env, "Tech Conference 2024"),
        &String::from_str(&env, "A great tech conference"),
        &String::from_str(&env, "Tech"),
        &String::from_str(&env, "2024-12-01"),
        &String::from_str(&env, "10:00"),
        &String::from_str(&env, "Convention Center"),
        &100,
    );

    assert_eq!(event_id, 1);

    let event = client.get_event(&event_id).unwrap();
    assert_eq!(event.id, 1);
    assert_eq!(event.title, String::from_str(&env, "Tech Conference 2024"));
    assert_eq!(event.max_participants, 100);
    assert_eq!(event.current_participants, 0);
    assert_eq!(event.organizer, organizer);
}

#[test]
fn test_get_all_events() {
    let env = Env::default();
    let contract_id = env.register(EventManager, ());
    let client = EventManagerClient::new(&env, &contract_id);

    let organizer = Address::generate(&env);
    
    env.mock_all_auths();

    // Create first event
    client.create_event(
        &organizer,
        &String::from_str(&env, "Event 1"),
        &String::from_str(&env, "Description 1"),
        &String::from_str(&env, "Tech"),
        &String::from_str(&env, "2024-12-01"),
        &String::from_str(&env, "10:00"),
        &String::from_str(&env, "Location 1"),
        &50,
    );

    // Create second event
    client.create_event(
        &organizer,
        &String::from_str(&env, "Event 2"),
        &String::from_str(&env, "Description 2"),
        &String::from_str(&env, "Sports"),
        &String::from_str(&env, "2024-12-15"),
        &String::from_str(&env, "14:00"),
        &String::from_str(&env, "Location 2"),
        &100,
    );

    let events = client.get_all_events();
    assert_eq!(events.len(), 2);
    assert_eq!(events.get(0).unwrap().title, String::from_str(&env, "Event 1"));
    assert_eq!(events.get(1).unwrap().title, String::from_str(&env, "Event 2"));
}

#[test]
fn test_register_for_event() {
    let env = Env::default();
    let contract_id = env.register(EventManager, ());
    let client = EventManagerClient::new(&env, &contract_id);

    let organizer = Address::generate(&env);
    let participant = Address::generate(&env);
    
    env.mock_all_auths();

    // Create event
    let event_id = client.create_event(
        &organizer,
        &String::from_str(&env, "Conference"),
        &String::from_str(&env, "Tech conference"),
        &String::from_str(&env, "Tech"),
        &String::from_str(&env, "2024-12-01"),
        &String::from_str(&env, "10:00"),
        &String::from_str(&env, "Center"),
        &100,
    );

    // Register participant
    let result = client.register_for_event(&event_id, &participant);
    assert_eq!(result, true);

    // Check registration
    let is_registered = client.is_registered(&event_id, &participant);
    assert_eq!(is_registered, true);

    // Check participant count updated
    let event = client.get_event(&event_id).unwrap();
    assert_eq!(event.current_participants, 1);
}

#[test]
#[should_panic(expected = "Already registered")]
fn test_duplicate_registration() {
    let env = Env::default();
    let contract_id = env.register(EventManager, ());
    let client = EventManagerClient::new(&env, &contract_id);

    let organizer = Address::generate(&env);
    let participant = Address::generate(&env);
    
    env.mock_all_auths();

    // Create event
    let event_id = client.create_event(
        &organizer,
        &String::from_str(&env, "Event"),
        &String::from_str(&env, "Description"),
        &String::from_str(&env, "Tech"),
        &String::from_str(&env, "2024-12-01"),
        &String::from_str(&env, "10:00"),
        &String::from_str(&env, "Location"),
        &100,
    );

    // Register once
    client.register_for_event(&event_id, &participant);

    // Try to register again - should panic
    client.register_for_event(&event_id, &participant);
}

#[test]
#[should_panic(expected = "Event is full")]
fn test_event_full() {
    let env = Env::default();
    let contract_id = env.register(EventManager, ());
    let client = EventManagerClient::new(&env, &contract_id);

    let organizer = Address::generate(&env);
    
    env.mock_all_auths();

    // Create event with max 2 participants
    let event_id = client.create_event(
        &organizer,
        &String::from_str(&env, "Small Event"),
        &String::from_str(&env, "Limited seats"),
        &String::from_str(&env, "Workshop"),
        &String::from_str(&env, "2024-12-01"),
        &String::from_str(&env, "10:00"),
        &String::from_str(&env, "Room A"),
        &2,
    );

    // Register two participants
    let participant1 = Address::generate(&env);
    let participant2 = Address::generate(&env);
    let participant3 = Address::generate(&env);

    client.register_for_event(&event_id, &participant1);
    client.register_for_event(&event_id, &participant2);

    // Third registration should fail
    client.register_for_event(&event_id, &participant3);
}

#[test]
#[should_panic(expected = "Max participants must be greater than 0")]
fn test_invalid_max_participants() {
    let env = Env::default();
    let contract_id = env.register(EventManager, ());
    let client = EventManagerClient::new(&env, &contract_id);

    let organizer = Address::generate(&env);
    
    env.mock_all_auths();

    // Try to create event with 0 max participants
    client.create_event(
        &organizer,
        &String::from_str(&env, "Invalid Event"),
        &String::from_str(&env, "No seats"),
        &String::from_str(&env, "Tech"),
        &String::from_str(&env, "2024-12-01"),
        &String::from_str(&env, "10:00"),
        &String::from_str(&env, "Nowhere"),
        &0,
    );
}

#[test]
fn test_get_user_registrations() {
    let env = Env::default();
    let contract_id = env.register(EventManager, ());
    let client = EventManagerClient::new(&env, &contract_id);

    let organizer = Address::generate(&env);
    let participant = Address::generate(&env);
    
    env.mock_all_auths();

    // Create two events
    let event_id1 = client.create_event(
        &organizer,
        &String::from_str(&env, "Event 1"),
        &String::from_str(&env, "Description 1"),
        &String::from_str(&env, "Tech"),
        &String::from_str(&env, "2024-12-01"),
        &String::from_str(&env, "10:00"),
        &String::from_str(&env, "Location 1"),
        &50,
    );

    let event_id2 = client.create_event(
        &organizer,
        &String::from_str(&env, "Event 2"),
        &String::from_str(&env, "Description 2"),
        &String::from_str(&env, "Sports"),
        &String::from_str(&env, "2024-12-15"),
        &String::from_str(&env, "14:00"),
        &String::from_str(&env, "Location 2"),
        &100,
    );

    // Register for both events
    client.register_for_event(&event_id1, &participant);
    client.register_for_event(&event_id2, &participant);

    // Get user registrations
    let registrations = client.get_user_registrations(&participant);
    assert_eq!(registrations.len(), 2);
    assert_eq!(registrations.get(0).unwrap(), event_id1);
    assert_eq!(registrations.get(1).unwrap(), event_id2);
}

#[test]
fn test_get_event_registrations() {
    let env = Env::default();
    let contract_id = env.register(EventManager, ());
    let client = EventManagerClient::new(&env, &contract_id);

    let organizer = Address::generate(&env);
    let participant1 = Address::generate(&env);
    let participant2 = Address::generate(&env);
    
    env.mock_all_auths();

    // Create event
    let event_id = client.create_event(
        &organizer,
        &String::from_str(&env, "Popular Event"),
        &String::from_str(&env, "Many participants"),
        &String::from_str(&env, "Conference"),
        &String::from_str(&env, "2024-12-01"),
        &String::from_str(&env, "10:00"),
        &String::from_str(&env, "Convention Center"),
        &100,
    );

    // Register multiple participants
    client.register_for_event(&event_id, &participant1);
    client.register_for_event(&event_id, &participant2);

    // Get event registrations
    let registrations = client.get_event_registrations(&event_id);
    assert_eq!(registrations.len(), 2);
    assert_eq!(registrations.get(0).unwrap(), participant1);
    assert_eq!(registrations.get(1).unwrap(), participant2);
}

#[test]
#[should_panic(expected = "Event not found")]
fn test_register_for_nonexistent_event() {
    let env = Env::default();
    let contract_id = env.register(EventManager, ());
    let client = EventManagerClient::new(&env, &contract_id);

    let participant = Address::generate(&env);
    
    env.mock_all_auths();

    // Try to register for non-existent event
    client.register_for_event(&999, &participant);
}
