require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const WHOIS_API_KEY = process.env.WHOIS_API_KEY;
const WHOIS_URL = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${WHOIS_API_KEY}&outputFormat=json`;

const PORT = process.env.PORT || 5000;

/**
 * @route POST /whois
 * @desc Fetch domain information from Whois API
 */
app.post('/whois', async (req, res) => {
    const { domain, type } = req.body;
    
    if (!domain || !type) {
        return res.status(400).json({ error: "Domain and type are required" });
    }

    try {
        const response = await axios.get(WHOIS_URL, {
            params: { domainName: domain }
        });

        const data = response.data.WhoisRecord;
        if (!data) return res.status(404).json({ error: "No data found" });

        let result = {};
        if (type === "domain") {
            result = {
                domain: data.domainName,
                registrar: data.registrarName || "N/A",
                registrationDate: data.createdDate || "N/A",
                expirationDate: data.expiresDate || "N/A",
                estimatedAge: data.estimatedDomainAge ? `${data.estimatedDomainAge} days` : "N/A",
                hostnames: data.nameServers && data.nameServers.hostNames
                    ? data.nameServers.hostNames.join(", ").slice(0, 25) + "..."
                    : "N/A"
            };
        } else if (type === "contact") {
            result = {
                registrant: data.registrant ? data.registrant.name : "N/A",
                technicalContact: data.technicalContact ? data.technicalContact.name : "N/A",
                adminContact: data.administrativeContact ? data.administrativeContact.name : "N/A",
                email: data.contactEmail || "N/A"
            };
        }

        res.json(result);
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: "Error fetching data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
