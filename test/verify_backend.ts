import axios from 'axios';

const BASE_URL = 'http://localhost:3002'; // Updated to match .env
const api = axios.create({
    baseURL: BASE_URL,
    validateStatus: () => true, // Don't throw on error status
});

async function runVerification() {
    console.log('Starting Backend Verification...');

    try {
        let accessToken = '';
        let userId = '';

        // 1. Auth: Register
        const testUser = {
            email: `test_${Date.now()}@example.com`,
            password: 'password123',
            full_name: 'Test User',
            phone: `+99890${Math.floor(1000000 + Math.random() * 9000000)}`,
        };

        console.log(`\n[AUTH] Registering user: ${testUser.email}`);
        let res;
        try {
            res = await api.post('/auth/register', testUser);
        } catch (e: any) {
            console.error('Register Request Failed:', e.message);
            if (e.cause) console.error('Cause:', e.cause);
            return;
        }

        console.log(`Status: ${res.status}`);
        if (res.status === 201 || res.status === 200) {
            console.log('Register Success');
            // Some APIs return token on register, some require login. 
            // Let's assume we need to login if no token here.
            if (res.data && res.data.accessToken) {
                accessToken = res.data.accessToken;
                console.log('Got access token from register');
            }
        } else {
            console.error('Register Failed:', res.data);
        }

        // 2. Auth: Login
        if (!accessToken) {
            console.log(`\n[AUTH] Logging in user: ${testUser.email}`);
            try {
                res = await api.post('/auth/login', { email: testUser.email, password: testUser.password });
            } catch (e: any) {
                console.error('Login Request Failed:', e.message);
                return;
            }

            console.log(`Status: ${res.status}`);
            if (res.status === 200 || res.status === 201) {
                accessToken = res.data.accessToken || res.data.access_token || res.data.token;
                console.log('Login Success, Token obtained');
            } else {
                console.error('Login Failed:', res.data);
                return; // Cannot proceed without token
            }
        }

        // Set Auth Header
        const authHeaders = { Authorization: `Bearer ${accessToken}` };

        // 3. User Profile
        console.log(`\n[USER] Get Profile`);
        try {
            // Try common endpoints
            res = await api.get('/users/profile', { headers: authHeaders });
            if (res.status === 404) res = await api.get('/auth/profile', { headers: authHeaders });
            if (res.status === 404) res = await api.get('/users/me', { headers: authHeaders });
        } catch (e: any) {
            console.error('Profile Request Failed:', e.message);
        }

        console.log(`Status: ${res?.status}`);
        if (res?.status === 200) {
            console.log('Profile Success');
            userId = res.data.id;
            console.log('User ID:', userId);
        } else {
            console.error('Get Profile Failed:', res?.data);
        }

        // 4. Products (Public)
        console.log(`\n[PRODUCTS] Get All Products`);
        try {
            res = await api.get('/products');
        } catch (e: any) {
            console.error('Get Products Request Failed:', e.message);
        }

        console.log(`Status: ${res?.status}`);
        if (res?.status === 200) {
            console.log(`Got ${Array.isArray(res.data) ? res.data.length : 'some'} products`);
        } else {
            console.error('Get Products Failed:', res?.data);
        }

        // 5. Cart
        let productId;
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
            productId = res.data[0].id; // Ensure this matches actual ID field
        }

        if (productId) {
            console.log(`\n[CART] Add Product ${productId} to Cart`);
            try {
                res = await api.post('/cart', { productId: productId, quantity: 1 }, { headers: authHeaders });
            } catch (e: any) {
                console.error('Add to Cart Request Failed:', e.message);
            }
            console.log(`Status: ${res?.status}`);
            if (res?.status === 201 || res?.status === 200) {
                console.log('Added to cart');
            } else {
                console.error('Add to Cart Failed:', res?.data);
            }

            console.log(`\n[CART] Get Cart`);
            try {
                res = await api.get('/cart', { headers: authHeaders });
            } catch (e: any) {
                console.error('Get Cart Request Failed:', e.message);
            }
            console.log(`Status: ${res?.status}`);
            if (res?.status === 200) {
                console.log('Get Cart Success');
            } else {
                console.error('Get Cart Failed:', res?.data);
            }
        } else {
            console.log('Skipping Cart test (No products found)');
        }
    } catch (err: any) {
        console.error('Verification Script Crashed:', err);
    }

    console.log('\nVerification Complete.');
}

runVerification();
