import http from 'k6/http';

export default function () {
  const payload = JSON.stringify({
    name: 'Tenali ',
    gender: 'male',
    email: 'whfiewhfiow@gmail.com',
    status: 'active'
  });
  const headers = { 
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer faff4f953d2791408aded8a45bff41e31eb8ebdf702576ced0f4ea8b2596b90d'
};
  http.post('https://gorest.co.in/public/v2/users', payload, { headers });
}
