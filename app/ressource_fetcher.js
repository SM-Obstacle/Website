import fetch from 'node-fetch'
import xml2js from 'xml2js'

const servers_URL = 'https://maniaplanet.com/webservices/servers/online?orderBy=name&offset=0&length=10&order=DESC&titleUids[]=obstacle@smokegun'

class ressource_fetcher {
    #servers_data


    constructor() {
        this.fetchXMLData()
        setInterval(() => this.#servers_data = this.fetchXMLData(servers_URL), 6 * 3_600_000) // 6 hours
    }

    async fetchXMLData(url) {
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            const xmlData = await response.text()
        
            // Convert XML to JavaScript object
            const parser = new xml2js.Parser()
            return await parser.parseStringPromise(xmlData)
        } catch (error) {
            console.error('Error fetching XML data:', error)
        }
    }

    async fetchJSONData(url) {
        try {
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`)
            }
            return await response.json()
        } catch (error) {
            console.error('Error fetching JSON data:', error)
        }
    }

    get servers_list() {
        return this.#servers_data
    }
}

export default new ressource_fetcher()