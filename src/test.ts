import api from './index'

const instance = api.create({
  host: 'https://api2.propbar.co.uk/property',
  logLevel: 'debug',
})

instance.query(
  `/propertyId/SDl0M2Fjbk45c3Zac0hGbmtLQ0dqdz09`,
  {
    attributes: 'pricing.currentSale'
  },
  {
    apiKey: ""
  }
);
