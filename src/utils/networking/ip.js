const getClientIp = (req) => 
    req.headers['x-client-ip'] || 
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
    req.ip;

module.exports = { getClientIp };
