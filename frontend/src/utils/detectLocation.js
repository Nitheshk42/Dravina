import API from '../services/api';

const currencies = [
  {code:'USD',flag:'🇺🇸'},{code:'INR',flag:'🇮🇳'},{code:'GBP',flag:'🇬🇧'},
  {code:'EUR',flag:'🇪🇺'},{code:'AUD',flag:'🇦🇺'},{code:'CAD',flag:'🇨🇦'},
  {code:'SGD',flag:'🇸🇬'},{code:'AED',flag:'🇦🇪'},
];

const countryCurrencyMap = {
  US:'USD', IN:'INR', GB:'GBP', AU:'AUD', CA:'CAD',
  SG:'SGD', AE:'AED', DE:'EUR', FR:'EUR', IT:'EUR',
  ES:'EUR', NL:'EUR', IE:'EUR', NZ:'AUD',
};

export const detectUserCurrency = async () => {
  try {
    const res = await API.get('/utils/location');
    const code = countryCurrencyMap[res.data.countryCode];
    if (code) return currencies.find(c => c.code === code) || currencies[0];
  } catch (error) {
    console.error('Error detecting user currency:', error);
  }
  return currencies[0]; // default USD
};