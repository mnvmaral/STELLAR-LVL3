#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, token, Address, Env, String, Vec};

#[derive(Clone)]
#[contracttype]
pub struct Event {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub category: String,
    pub date: String,
    pub time: String,
    pub location: String,
    pub organizer: Address,
    pub max_participants: u32,
    pub current_participants: u32,
    pub status: String,
    pub created_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub struct Registration {
    pub event_id: u64,
    pub participant: Address,
    pub registered_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    EventCounter,
    Event(u64),
    Registration(u64, Address),
    EventRegistrations(u64),
    UserRegistrations(Address),
}

#[contract]
pub struct EventManager;

#[contractimpl]
impl EventManager {
    /// Create a new event
    pub fn create_event(
        env: Env,
        organizer: Address,
        title: String,
        description: String,
        category: String,
        date: String,
        time: String,
        location: String,
        max_participants: u32,
    ) -> u64 {
        // Require organizer authorization
        organizer.require_auth();

        // Validate inputs
        if max_participants == 0 {
            panic!("Max participants must be greater than 0");
        }

        // Get next event ID
        let counter_key = DataKey::EventCounter;
        let event_id: u64 = env
            .storage()
            .instance()
            .get(&counter_key)
            .unwrap_or(0);
        let next_id = event_id + 1;

        // Create event
        let event = Event {
            id: next_id,
            title: title.clone(),
            description: description.clone(),
            category: category.clone(),
            date: date.clone(),
            time: time.clone(),
            location: location.clone(),
            organizer: organizer.clone(),
            max_participants,
            current_participants: 0,
            status: String::from_str(&env, "upcoming"),
            created_at: env.ledger().timestamp(),
        };

        // Store event
        env.storage()
            .instance()
            .set(&DataKey::Event(next_id), &event);
        
        // Update counter
        env.storage().instance().set(&counter_key, &next_id);

        // Emit event
        env.events().publish(
            (String::from_str(&env, "event_created"), next_id),
            (organizer, title),
        );

        next_id
    }

    /// Get event by ID
    pub fn get_event(env: Env, event_id: u64) -> Option<Event> {
        env.storage()
            .instance()
            .get(&DataKey::Event(event_id))
    }

    /// Get all events
    pub fn get_all_events(env: Env) -> Vec<Event> {
        let counter: u64 = env
            .storage()
            .instance()
            .get(&DataKey::EventCounter)
            .unwrap_or(0);

        let mut events = Vec::new(&env);
        
        for i in 1..=counter {
            if let Some(event) = env.storage().instance().get(&DataKey::Event(i)) {
                events.push_back(event);
            }
        }

        events
    }

    /// Register for an event
    pub fn register_for_event(env: Env, event_id: u64, participant: Address) -> bool {
        // Require participant authorization
        participant.require_auth();

        // Get event
        let event_key = DataKey::Event(event_id);
        let mut event: Event = env
            .storage()
            .instance()
            .get(&event_key)
            .expect("Event not found");

        // Check if event is full
        if event.current_participants >= event.max_participants {
            panic!("Event is full");
        }

        // Check if already registered
        let reg_key = DataKey::Registration(event_id, participant.clone());
        if env.storage().instance().has(&reg_key) {
            panic!("Already registered");
        }

        // Create registration
        let registration = Registration {
            event_id,
            participant: participant.clone(),
            registered_at: env.ledger().timestamp(),
        };

        // Store registration
        env.storage().instance().set(&reg_key, &registration);

        // Update event participant count
        event.current_participants += 1;
        env.storage().instance().set(&event_key, &event);

        // Add to event registrations list
        let event_regs_key = DataKey::EventRegistrations(event_id);
        let mut event_regs: Vec<Address> = env
            .storage()
            .instance()
            .get(&event_regs_key)
            .unwrap_or(Vec::new(&env));
        event_regs.push_back(participant.clone());
        env.storage().instance().set(&event_regs_key, &event_regs);

        // Add to user registrations list
        let user_regs_key = DataKey::UserRegistrations(participant.clone());
        let mut user_regs: Vec<u64> = env
            .storage()
            .instance()
            .get(&user_regs_key)
            .unwrap_or(Vec::new(&env));
        user_regs.push_back(event_id);
        env.storage().instance().set(&user_regs_key, &user_regs);

        // Emit event
        env.events().publish(
            (String::from_str(&env, "user_registered"), event_id),
            participant,
        );

        true
    }

    /// Check if user is registered for an event
    pub fn is_registered(env: Env, event_id: u64, participant: Address) -> bool {
        let reg_key = DataKey::Registration(event_id, participant);
        env.storage().instance().has(&reg_key)
    }

    /// Get user's registrations
    pub fn get_user_registrations(env: Env, user: Address) -> Vec<u64> {
        let user_regs_key = DataKey::UserRegistrations(user);
        env.storage()
            .instance()
            .get(&user_regs_key)
            .unwrap_or(Vec::new(&env))
    }

    /// Get event registrations
    pub fn get_event_registrations(env: Env, event_id: u64) -> Vec<Address> {
        let event_regs_key = DataKey::EventRegistrations(event_id);
        env.storage()
            .instance()
            .get(&event_regs_key)
            .unwrap_or(Vec::new(&env))
    }
}

mod test;
