import { Country } from '@feature/address/enum/country-iso3166.enum'
import { AddressType } from '@feature/address/enum/address-type.enum'

export const addressMock: any[] = [
  {
    id: '2a876a60-1a4b-4a3b-b4a2-825670984dbd',
    firstName: 'Eugenia',
    lastName: 'Ratke',
    line1: '869 Lehner Cliff',
    zipCode: '03071',
    state: 'Florida',
    phone: '+41 76 951 06 95',
    countryCode: Country.UK,
    primary: 1,
    type: AddressType.BILLING,
    user: { id: '05cff960-9ebe-4689-8b55-4011a99a6792' },
  },
  {
    id: '2b94f351-5416-425f-847b-c4610ea5aa6c',
    firstName: 'Lia',
    lastName: 'Brown',
    line1: '97628 Roberto Path',
    zipCode: 73945,
    state: 'New Hampshire',
    phone: '+41 76 407 89 95',
    countryCode: Country.ES,
    primary: 0,
    type: AddressType.BILLING,
    user: { id: '05cff960-9ebe-4689-8b55-4011a99a6792' },
  },
  {
    id: '3b77a5da-efe3-44c6-8a00-9a0bf56553cb',
    firstName: 'Myra',
    lastName: 'Bogisich',
    line1: '2610 Oceane Crossroad',
    zipCode: 59230,
    state: 'Vermont',
    phone: '+41 76 382 97 16',
    countryCode: Country.PL,
    type: AddressType.SHIPPING,
    user: { id: '1b6a7084-3c74-4975-af8f-6a268aff6116' },
  },
  {
    id: '53ffc4e9-7338-4fd5-b66e-4cd08dbedcb2',
    firstName: 'Margarita',
    lastName: 'Bartoletti',
    line1: '30440 Webster Mountains',
    zipCode: 21896,
    state: 'Minnesota',
    phone: '+41 76 261 24 28',
    countryCode: Country.NL,
    primary: 1,
    type: AddressType.BILLING,
    user: { id: '1b6a7084-3c74-4975-af8f-6a268aff6116' },
  },
  {
    id: '546e442b-92b8-4f78-896a-311407f284f3',
    firstName: 'Emmanuel',
    lastName: 'Wehner',
    line1: '4182 Hammes Course',
    zipCode: '00895',
    state: 'Maryland',
    phone: '+41 76 046 05 77',
    countryCode: Country.IT,
    type: AddressType.BILLING,
    user: { id: '1cdefcb4-edb2-4365-925d-4ebcb7b5f185' },
  },
  {
    id: '593e5d61-99c5-497e-8e5d-5f635481d242',
    firstName: 'Novella',
    lastName: 'Murray',
    line1: '767 Earnestine Pines',
    zipCode: 22036,
    state: 'Wyoming',
    phone: '+41 76 662 54 99',
    countryCode: Country.DE,
    primary: 1,
    type: AddressType.SHIPPING,
    user: { id: '1cdefcb4-edb2-4365-925d-4ebcb7b5f185' },
  },
  {
    id: '5cfbbc17-836d-48ed-9e9c-56051e463269',
    firstName: 'Trisha',
    lastName: 'Turner',
    line1: '218 Brendan Avenue',
    zipCode: 82245,
    state: 'New Hampshire',
    phone: '+41 76 297 49 17',
    countryCode: Country.FR,
    primary: 0,
    type: AddressType.SHIPPING,
    user: { id: 'f6eef4f4-d904-4b61-8012-2c7c2792c1bb' },
  },
  {
    id: '838410f2-abff-488d-8934-caae78c3b166',
    firstName: 'Hettie',
    lastName: 'Smitham',
    line1: '98691 Zemlak Rapid',
    zipCode: 53663,
    state: 'Arkansas',
    phone: '+41 76 249 42 27',
    countryCode: Country.AT,
    primary: 1,
    type: AddressType.BILLING,
    user: { id: 'f6eef4f4-d904-4b61-8012-2c7c2792c1bb' },
  },
  {
    id: '8a13f55b-1a8d-4702-b530-d6ab83407823',
    firstName: 'Addie',
    lastName: 'Zulauf',
    line1: '1493 Bruen Loop',
    zipCode: 99588,
    state: 'Nebraska',
    phone: '+41 76 491 88 06',
    countryCode: Country.NL,
    type: AddressType.BILLING,
    user: { id: '05cff960-9ebe-4689-8b55-4011a99a6792' },
  },
  {
    id: '9568288d-d391-4531-9c92-a18cfc88cb3b',
    firstName: 'Ashleigh',
    lastName: 'Bogan',
    line1: '6073 Rosenbaum Skyway',
    zipCode: 88175,
    state: 'Alabama',
    phone: '+41 76 574 52 79',
    countryCode: Country.PL,
    type: AddressType.SHIPPING,
    user: { id: '1b6a7084-3c74-4975-af8f-6a268aff6116' },
  },
  {
    id: 'a25f2417-0e60-4589-8acb-17dcf970ef81',
    firstName: 'Sandrine',
    lastName: 'DuBuque',
    line1: '8862 Brandy Dam',
    zipCode: 63838,
    state: 'Kentucky',
    phone: '+41 76 601 02 76',
    countryCode: Country.DE,
    primary: 1,
    type: AddressType.SHIPPING,
    user: { id: '1b6a7084-3c74-4975-af8f-6a268aff6116' },
  },
  {
    id: 'd78de70f-9748-40a8-aae9-a2a569b8b1af',
    firstName: 'Gage',
    lastName: 'Bergstrom',
    line1: '613 Julia Glens',
    zipCode: 88279,
    state: 'Vermont',
    phone: '+41 76 190 30 66',
    countryCode: Country.FR,
    type: AddressType.SHIPPING,
    user: { id: '05cff960-9ebe-4689-8b55-4011a99a6792' },
  },
  {
    id: 'dab2b3b8-97d3-4c8b-a820-ce60d9401481',
    firstName: 'Felicity',
    lastName: "O'Hara",
    line1: '50207 Parisian Islands',
    zipCode: '07997',
    state: 'Alabama',
    phone: '+41 76 401 29 12',
    countryCode: Country.IT,
    primary: 1,
    type: AddressType.SHIPPING,
    user: { id: '05cff960-9ebe-4689-8b55-4011a99a6792' },
  },
  {
    id: 'ecf65695-92a0-4265-b071-a4e95a549a9a',
    firstName: 'Theodora',
    lastName: 'Predovic',
    line1: '424 Gregorio Lakes',
    zipCode: 25061,
    state: 'Idaho',
    phone: '+41 76 263 43 56',
    countryCode: Country.CH,
    primary: 1,
    type: AddressType.SHIPPING,
    user: { id: 'f6eef4f4-d904-4b61-8012-2c7c2792c1bb' },
  },
  {
    id: 'f95870fe-23f3-4785-b3ec-3742451ccc2c',
    firstName: 'Theodora',
    lastName: 'Predovic',
    line1: 'Via Pestariso 86',
    zipCode: 9027,
    state: 'St. Gallen',
    phone: '+41 71 938 15 50',
    countryCode: 'CH',
    primary: 0,
    type: AddressType.SHIPPING,
    user: { id: 'f6eef4f4-d904-4b61-8012-2c7c2792c1bb' },
  },
  {
    id: 'f7fb967c-84dc-434a-86a2-22ca860affe1',
    firstName: 'Dustin',
    lastName: 'Ebert',
    line1: '84129 Christophe Flats',
    zipCode: 5706,
    state: 'Virginia',
    phone: '+41 76 893 60 57',
    countryCode: Country.CH,
    type: AddressType.BILLING,
    user: { id: 'f6eef4f4-d904-4b61-8012-2c7c2792c1bb' },
  },
  {
    id: 'ac9c1081-659c-44f9-a463-afb5004be4a6',
    firstName: 'Jefferson',
    lastName: 'Wellington',
    line1: 'Obere Bahnhofstrasse 14',
    zipCode: 4085,
    state: 'Basel',
    phone: '+41 71 252 11 83',
    countryCode: 'CH',
    type: AddressType.BILLING,
    user: { id: 'f6eef4f4-d904-4b61-8012-2c7c2792c1bb' },
  },
]