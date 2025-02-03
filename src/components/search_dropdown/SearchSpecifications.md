<!-- urbverde-ui/src/components/search_dropdown/SearchSpecifications.md -->
# GetUserLocation Component

## Purpose
Handles user location detection through two complementary methods: IP-based geolocation (automatic) and browser geolocation API (permission-based), with smart prompting for location permission.

## Design Decisions
1. Dual Detection Methods
   - IP-based (Backend):
     - Triggers automatically on component mount
     - Provides immediate approximate location
     - No caching - always fresh data
     - Handles API key security by moving request to backend
   - Browser Geolocation:
     - Requires explicit user permission
     - Provides more accurate coordinates
     - Takes precedence when granted
     - Permission state managed by browser

2. Smart Location Management
   - Always fetches fresh IP location on mount
   - Detects significant location changes via IP
   - Prompts user for precise location when:
     * First visit
     * Significant IP location change detected
     * User explicitly requests it
   - Cannot force browser permission prompt (browser security feature)
   - Uses UI prompts to encourage user opt-in for precise location

3. State Management
   - Updates Pinia store for reactive state
   - Clear precedence: browser geolocation overwrites IP-based data

## Security Considerations
- IP geolocation API key moved to backend
- User privacy respected through browser permission system
- Fresh IP checks ensure location accuracy

## Usage Flow
1. Component mounts → fresh IP location fetched
2. If significant location change detected → prompt user for precise location
3. User can request precise location anytime
4. Success from either method updates Pinia store
5. Browser manages its own geolocation permission state
