import { check, group, sleep, fail } from 'k6';
import { Rate } from 'k6/metrics';
import http from 'k6/http';
import { parseHTML } from 'k6/html';
import { Trend } from 'k6/metrics';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.1/index.js';

const baseUrl = 'https://gorest.co.in';
const users = JSON.parse(open('test-data.json'));

//Transaction Metrics

const createUserAPITrend = new Trend('POST /createUser Create User API ');
const updateUserAPITrend = new Trend('PATCH /updateUser Update User API ');
const fetchUsersAPITrend = new Trend('GET /userList Fetch list of Users ');
const deleteUserAPITrend = new Trend('DELETE /deleteUser Delete User API');

// export let options = {
// 	stages: [
// 		{ duration: '1m', target: 50 },
// 		{ duration: '2m', target: 100 },
// 		{ duration: '2m', target: 0 },
// 	],
// 	thresholds: {
// 		'http_req_duration': ['p(95)<1000'], // 99% of requests must complete below 2000ms
// 		'http_req_duration{status:200}': ['max>=0'],
//         'http_req_duration{status:201}': ['max>=0'],
//         'http_req_duration{status:400}': ['max>=0'],
//         'http_req_duration{status:500}': ['max>=0'],
//         'http_req_duration{status:502}': ['max>=0'],
// 	},
// 	'summaryTrendStats': ['min', 'med', 'avg', 'p(90)', 'p(95)', 'max', 'count'],
// };

export default function goRestAPI() {
	
	const headers = {
        'Accept': 'application/json',
		'Content-Type': 'application/json',
        'Authorization': 'Bearer faff4f953d2791408aded8a45bff41e31eb8ebdf702576ced0f4ea8b2596b90d'
	};		
    
	let user = users[Math.floor(Math.random() * users.length)];
    let userEmail = 'testUser'+ Math.random*10000+'@yopmail.com';

    let createPayload = JSON.stringify({
		name: 'khki',
        gender: 'hiuh',
        email: 'hfkuwshfif@gamil.com',
        status: 'active'
	});

	// Create cart
	const createUser_response = httpPost(
		`https://gorest.co.in/public/v2/users`,
		headers,
        createPayload,
		201
	);
	console.log(createUser_response);
	createUserAPITrend.add(createUser_response.timings.duration);

	check(createUser_response, {
		'Create user response success  ': (r) => r.status === 201,
	});

 		// // List User API

		// const fetchUser_response = httpGet(
		// 	`https://gorest.co.in/public/v2/users`,
		// 	globalOptions,
		// 	200
		// );
		
		// console.log(fetchUser_response);
		// fetchUsersAPITrend.add(fetchUser_response.timings.duration);
		// check(fetchUser_response, {
		// 	'Add to cart response success  ': (r) => r.status === 200,
		// });

	// 	const removeVoucher_response = httpDelete(
	// 		`${baseUrl}/cart/removeVoucher?userId=${userId}&cartId=${cartId}&voucherId=${voucherId}&fields=BASIC`,
	// 		undefined,
	// 		globalOptions,
	// 		200
	// 	);

	// 	removeVoucherAPITrend.add(removeVoucher_response.timings.duration);
	// 	check(removeVoucher_response, {
	// 		'Remove Voucher API response success > ': (r) => r.status === 200,
	// 	});

    }

function httpGet(url, params, expectedResponseCode) {
	var res;
	for (var retries = 3; retries > 0; retries--) {
		res = http.get(url, params);
		if (res.status == expectedResponseCode) {
			return res;
		}
	}
	return res;
}

function httpPost(url, payload, params, expectedResponseCode) {
	var res;
	for (var retries = 2; retries > 0; retries--) {
		res = http.post(url, payload, params);
		if (res.status == expectedResponseCode) {
			return res;
		}
	}
	return res;
}

function httpPut(url, payload, params, expectedResponseCode) {
	var res;
	for (var retries = 2; retries > 0; retries--) {
		res = http.put(url, payload, params);
		if (res.status == expectedResponseCode) {
			return res;
		}
	}
	return res;
}

function httpDelete(url, payload, params, expectedResponseCode) {
	var res;
	for (var retries = 3; retries > 0; retries--) {
		res = http.del(url, payload, params);
		if (res.status == expectedResponseCode) {
			return res;
		}
	}
	return res;
}

export function handleSummary(data) {
	return {
		'result.html': htmlReport(data),
		stdout: textSummary(data, { indent: ' ', enableColors: true }),
	};
}