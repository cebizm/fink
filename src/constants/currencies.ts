// World currencies with their symbols, flags and names
export interface Currency {
    code: string;
    name: string;
    nameTr: string;
    symbol: string;
    flag: string;
}

export const worldCurrencies: Currency[] = [
    // Major Currencies
    { code: 'USD', name: 'US Dollar', nameTr: 'Amerikan Doları', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', nameTr: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', nameTr: 'İngiliz Sterlini', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', nameTr: 'Japon Yeni', symbol: '¥', flag: '🇯🇵' },
    { code: 'CHF', name: 'Swiss Franc', nameTr: 'İsviçre Frangı', symbol: 'Fr', flag: '🇨🇭' },
    { code: 'CAD', name: 'Canadian Dollar', nameTr: 'Kanada Doları', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', nameTr: 'Avustralya Doları', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CNY', name: 'Chinese Yuan', nameTr: 'Çin Yuanı', symbol: '¥', flag: '🇨🇳' },
    { code: 'HKD', name: 'Hong Kong Dollar', nameTr: 'Hong Kong Doları', symbol: 'HK$', flag: '🇭🇰' },
    { code: 'NZD', name: 'New Zealand Dollar', nameTr: 'Yeni Zelanda Doları', symbol: 'NZ$', flag: '🇳🇿' },

    // European Currencies
    { code: 'SEK', name: 'Swedish Krona', nameTr: 'İsveç Kronu', symbol: 'kr', flag: '🇸🇪' },
    { code: 'NOK', name: 'Norwegian Krone', nameTr: 'Norveç Kronu', symbol: 'kr', flag: '🇳🇴' },
    { code: 'DKK', name: 'Danish Krone', nameTr: 'Danimarka Kronu', symbol: 'kr', flag: '🇩🇰' },
    { code: 'PLN', name: 'Polish Zloty', nameTr: 'Polonya Zlotisi', symbol: 'zł', flag: '🇵🇱' },
    { code: 'CZK', name: 'Czech Koruna', nameTr: 'Çek Korunası', symbol: 'Kč', flag: '🇨🇿' },
    { code: 'HUF', name: 'Hungarian Forint', nameTr: 'Macar Forinti', symbol: 'Ft', flag: '🇭🇺' },
    { code: 'RON', name: 'Romanian Leu', nameTr: 'Romanya Leyi', symbol: 'lei', flag: '🇷🇴' },
    { code: 'BGN', name: 'Bulgarian Lev', nameTr: 'Bulgar Levası', symbol: 'лв', flag: '🇧🇬' },
    { code: 'HRK', name: 'Croatian Kuna', nameTr: 'Hırvat Kunası', symbol: 'kn', flag: '🇭🇷' },
    { code: 'RSD', name: 'Serbian Dinar', nameTr: 'Sırp Dinarı', symbol: 'дин', flag: '🇷🇸' },
    { code: 'UAH', name: 'Ukrainian Hryvnia', nameTr: 'Ukrayna Grivnası', symbol: '₴', flag: '🇺🇦' },
    { code: 'RUB', name: 'Russian Ruble', nameTr: 'Rus Rublesi', symbol: '₽', flag: '🇷🇺' },
    { code: 'ISK', name: 'Icelandic Króna', nameTr: 'İzlanda Kronası', symbol: 'kr', flag: '🇮🇸' },

    // Middle East & Central Asia
    { code: 'TRY', name: 'Turkish Lira', nameTr: 'Türk Lirası', symbol: '₺', flag: '🇹🇷' },
    { code: 'SAR', name: 'Saudi Riyal', nameTr: 'Suudi Riyali', symbol: '﷼', flag: '🇸🇦' },
    { code: 'AED', name: 'UAE Dirham', nameTr: 'BAE Dirhemi', symbol: 'د.إ', flag: '🇦🇪' },
    { code: 'QAR', name: 'Qatari Riyal', nameTr: 'Katar Riyali', symbol: '﷼', flag: '🇶🇦' },
    { code: 'KWD', name: 'Kuwaiti Dinar', nameTr: 'Kuveyt Dinarı', symbol: 'د.ك', flag: '🇰🇼' },
    { code: 'BHD', name: 'Bahraini Dinar', nameTr: 'Bahreyn Dinarı', symbol: '.د.ب', flag: '🇧🇭' },
    { code: 'OMR', name: 'Omani Rial', nameTr: 'Umman Riyali', symbol: '﷼', flag: '🇴🇲' },
    { code: 'JOD', name: 'Jordanian Dinar', nameTr: 'Ürdün Dinarı', symbol: 'د.ا', flag: '🇯🇴' },
    { code: 'ILS', name: 'Israeli Shekel', nameTr: 'İsrail Şekeli', symbol: '₪', flag: '🇮🇱' },
    { code: 'EGP', name: 'Egyptian Pound', nameTr: 'Mısır Poundu', symbol: '£', flag: '🇪🇬' },
    { code: 'IQD', name: 'Iraqi Dinar', nameTr: 'Irak Dinarı', symbol: 'ع.د', flag: '🇮🇶' },
    { code: 'IRR', name: 'Iranian Rial', nameTr: 'İran Riyali', symbol: '﷼', flag: '🇮🇷' },
    { code: 'LBP', name: 'Lebanese Pound', nameTr: 'Lübnan Poundu', symbol: 'ل.ل', flag: '🇱🇧' },
    { code: 'SYP', name: 'Syrian Pound', nameTr: 'Suriye Poundu', symbol: '£', flag: '🇸🇾' },
    { code: 'AZN', name: 'Azerbaijani Manat', nameTr: 'Azerbaycan Manatı', symbol: '₼', flag: '🇦🇿' },
    { code: 'GEL', name: 'Georgian Lari', nameTr: 'Gürcistan Larisi', symbol: '₾', flag: '🇬🇪' },
    { code: 'AMD', name: 'Armenian Dram', nameTr: 'Ermeni Dramı', symbol: '֏', flag: '🇦🇲' },
    { code: 'KZT', name: 'Kazakhstani Tenge', nameTr: 'Kazak Tengesi', symbol: '₸', flag: '🇰🇿' },
    { code: 'UZS', name: 'Uzbekistani Som', nameTr: 'Özbek Somu', symbol: 'so\'m', flag: '🇺🇿' },
    { code: 'TMT', name: 'Turkmenistani Manat', nameTr: 'Türkmen Manatı', symbol: 'm', flag: '🇹🇲' },
    { code: 'KGS', name: 'Kyrgyzstani Som', nameTr: 'Kırgız Somu', symbol: 'с', flag: '🇰🇬' },
    { code: 'TJS', name: 'Tajikistani Somoni', nameTr: 'Tacik Somonisi', symbol: 'ЅМ', flag: '🇹🇯' },
    { code: 'AFN', name: 'Afghan Afghani', nameTr: 'Afgan Afganisi', symbol: '؋', flag: '🇦🇫' },
    { code: 'PKR', name: 'Pakistani Rupee', nameTr: 'Pakistan Rupisi', symbol: '₨', flag: '🇵🇰' },

    // Asia Pacific
    { code: 'INR', name: 'Indian Rupee', nameTr: 'Hint Rupisi', symbol: '₹', flag: '🇮🇳' },
    { code: 'KRW', name: 'South Korean Won', nameTr: 'Güney Kore Wonu', symbol: '₩', flag: '🇰🇷' },
    { code: 'SGD', name: 'Singapore Dollar', nameTr: 'Singapur Doları', symbol: 'S$', flag: '🇸🇬' },
    { code: 'TWD', name: 'Taiwan Dollar', nameTr: 'Tayvan Doları', symbol: 'NT$', flag: '🇹🇼' },
    { code: 'THB', name: 'Thai Baht', nameTr: 'Tayland Bahtı', symbol: '฿', flag: '🇹🇭' },
    { code: 'MYR', name: 'Malaysian Ringgit', nameTr: 'Malezya Ringgiti', symbol: 'RM', flag: '🇲🇾' },
    { code: 'IDR', name: 'Indonesian Rupiah', nameTr: 'Endonezya Rupisi', symbol: 'Rp', flag: '🇮🇩' },
    { code: 'PHP', name: 'Philippine Peso', nameTr: 'Filipin Pesosu', symbol: '₱', flag: '🇵🇭' },
    { code: 'VND', name: 'Vietnamese Dong', nameTr: 'Vietnam Dongu', symbol: '₫', flag: '🇻🇳' },
    { code: 'BDT', name: 'Bangladeshi Taka', nameTr: 'Bangladeş Takası', symbol: '৳', flag: '🇧🇩' },
    { code: 'LKR', name: 'Sri Lankan Rupee', nameTr: 'Sri Lanka Rupisi', symbol: 'Rs', flag: '🇱🇰' },
    { code: 'NPR', name: 'Nepalese Rupee', nameTr: 'Nepal Rupisi', symbol: 'Rs', flag: '🇳🇵' },
    { code: 'MMK', name: 'Myanmar Kyat', nameTr: 'Myanmar Kyatı', symbol: 'K', flag: '🇲🇲' },
    { code: 'KHR', name: 'Cambodian Riel', nameTr: 'Kamboçya Rieli', symbol: '៛', flag: '🇰🇭' },
    { code: 'LAK', name: 'Lao Kip', nameTr: 'Laos Kipi', symbol: '₭', flag: '🇱🇦' },
    { code: 'MNT', name: 'Mongolian Tugrik', nameTr: 'Moğol Tugriki', symbol: '₮', flag: '🇲🇳' },
    { code: 'BND', name: 'Brunei Dollar', nameTr: 'Brunei Doları', symbol: 'B$', flag: '🇧🇳' },
    { code: 'FJD', name: 'Fijian Dollar', nameTr: 'Fiji Doları', symbol: 'FJ$', flag: '🇫🇯' },

    // Americas
    { code: 'MXN', name: 'Mexican Peso', nameTr: 'Meksika Pesosu', symbol: '$', flag: '🇲🇽' },
    { code: 'BRL', name: 'Brazilian Real', nameTr: 'Brezilya Reali', symbol: 'R$', flag: '🇧🇷' },
    { code: 'ARS', name: 'Argentine Peso', nameTr: 'Arjantin Pesosu', symbol: '$', flag: '🇦🇷' },
    { code: 'CLP', name: 'Chilean Peso', nameTr: 'Şili Pesosu', symbol: '$', flag: '🇨🇱' },
    { code: 'COP', name: 'Colombian Peso', nameTr: 'Kolombiya Pesosu', symbol: '$', flag: '🇨🇴' },
    { code: 'PEN', name: 'Peruvian Sol', nameTr: 'Peru Solu', symbol: 'S/', flag: '🇵🇪' },
    { code: 'UYU', name: 'Uruguayan Peso', nameTr: 'Uruguay Pesosu', symbol: '$U', flag: '🇺🇾' },
    { code: 'PYG', name: 'Paraguayan Guarani', nameTr: 'Paraguay Guaranisi', symbol: '₲', flag: '🇵🇾' },
    { code: 'BOB', name: 'Bolivian Boliviano', nameTr: 'Bolivya Bolivyanosu', symbol: 'Bs.', flag: '🇧🇴' },
    { code: 'VES', name: 'Venezuelan Bolívar', nameTr: 'Venezuela Bolivarı', symbol: 'Bs.S', flag: '🇻🇪' },
    { code: 'CRC', name: 'Costa Rican Colón', nameTr: 'Kosta Rika Kolonu', symbol: '₡', flag: '🇨🇷' },
    { code: 'PAB', name: 'Panamanian Balboa', nameTr: 'Panama Balboası', symbol: 'B/.', flag: '🇵🇦' },
    { code: 'DOP', name: 'Dominican Peso', nameTr: 'Dominik Pesosu', symbol: 'RD$', flag: '🇩🇴' },
    { code: 'GTQ', name: 'Guatemalan Quetzal', nameTr: 'Guatemala Quetzalı', symbol: 'Q', flag: '🇬🇹' },
    { code: 'HNL', name: 'Honduran Lempira', nameTr: 'Honduras Lempirası', symbol: 'L', flag: '🇭🇳' },
    { code: 'NIO', name: 'Nicaraguan Córdoba', nameTr: 'Nikaragua Kordobası', symbol: 'C$', flag: '🇳🇮' },
    { code: 'TTD', name: 'Trinidad Dollar', nameTr: 'Trinidad Doları', symbol: 'TT$', flag: '🇹🇹' },
    { code: 'JMD', name: 'Jamaican Dollar', nameTr: 'Jamaika Doları', symbol: 'J$', flag: '🇯🇲' },
    { code: 'BBD', name: 'Barbadian Dollar', nameTr: 'Barbados Doları', symbol: 'Bds$', flag: '🇧🇧' },
    { code: 'BSD', name: 'Bahamian Dollar', nameTr: 'Bahama Doları', symbol: 'B$', flag: '🇧🇸' },
    { code: 'CUP', name: 'Cuban Peso', nameTr: 'Küba Pesosu', symbol: '₱', flag: '🇨🇺' },
    { code: 'HTG', name: 'Haitian Gourde', nameTr: 'Haiti Gourdesi', symbol: 'G', flag: '🇭🇹' },

    // Africa
    { code: 'ZAR', name: 'South African Rand', nameTr: 'Güney Afrika Randı', symbol: 'R', flag: '🇿🇦' },
    { code: 'NGN', name: 'Nigerian Naira', nameTr: 'Nijerya Nairası', symbol: '₦', flag: '🇳🇬' },
    { code: 'KES', name: 'Kenyan Shilling', nameTr: 'Kenya Şilini', symbol: 'KSh', flag: '🇰🇪' },
    { code: 'GHS', name: 'Ghanaian Cedi', nameTr: 'Gana Cedisi', symbol: '₵', flag: '🇬🇭' },
    { code: 'TZS', name: 'Tanzanian Shilling', nameTr: 'Tanzanya Şilini', symbol: 'TSh', flag: '🇹🇿' },
    { code: 'UGX', name: 'Ugandan Shilling', nameTr: 'Uganda Şilini', symbol: 'USh', flag: '🇺🇬' },
    { code: 'ETB', name: 'Ethiopian Birr', nameTr: 'Etiyopya Birri', symbol: 'Br', flag: '🇪🇹' },
    { code: 'MAD', name: 'Moroccan Dirham', nameTr: 'Fas Dirhemi', symbol: 'د.م.', flag: '🇲🇦' },
    { code: 'DZD', name: 'Algerian Dinar', nameTr: 'Cezayir Dinarı', symbol: 'د.ج', flag: '🇩🇿' },
    { code: 'TND', name: 'Tunisian Dinar', nameTr: 'Tunus Dinarı', symbol: 'د.ت', flag: '🇹🇳' },
    { code: 'LYD', name: 'Libyan Dinar', nameTr: 'Libya Dinarı', symbol: 'ل.د', flag: '🇱🇾' },
    { code: 'SDG', name: 'Sudanese Pound', nameTr: 'Sudan Poundu', symbol: '£', flag: '🇸🇩' },
    { code: 'XOF', name: 'CFA Franc BCEAO', nameTr: 'Batı Afrika CFA Frangı', symbol: 'CFA', flag: '🌍' },
    { code: 'XAF', name: 'CFA Franc BEAC', nameTr: 'Orta Afrika CFA Frangı', symbol: 'FCFA', flag: '🌍' },
    { code: 'MUR', name: 'Mauritian Rupee', nameTr: 'Mauritius Rupisi', symbol: '₨', flag: '🇲🇺' },
    { code: 'BWP', name: 'Botswanan Pula', nameTr: 'Botsvana Pulası', symbol: 'P', flag: '🇧🇼' },
    { code: 'ZMW', name: 'Zambian Kwacha', nameTr: 'Zambiya Kvaçası', symbol: 'ZK', flag: '🇿🇲' },
    { code: 'AOA', name: 'Angolan Kwanza', nameTr: 'Angola Kvanzası', symbol: 'Kz', flag: '🇦🇴' },
    { code: 'MZN', name: 'Mozambican Metical', nameTr: 'Mozambik Metikali', symbol: 'MT', flag: '🇲🇿' },
    { code: 'RWF', name: 'Rwandan Franc', nameTr: 'Ruanda Frangı', symbol: 'FRw', flag: '🇷🇼' },

    // Crypto (bonus)
    { code: 'BTC', name: 'Bitcoin', nameTr: 'Bitcoin', symbol: '₿', flag: '🪙' },
    { code: 'ETH', name: 'Ethereum', nameTr: 'Ethereum', symbol: 'Ξ', flag: '🪙' },
    { code: 'USDT', name: 'Tether', nameTr: 'Tether', symbol: '₮', flag: '🪙' },
];

// Search currencies by code, name or Turkish name
export const searchCurrencies = (query: string): Currency[] => {
    if (!query.trim()) return worldCurrencies.slice(0, 10); // Show top 10 by default

    const lowerQuery = query.toLowerCase();
    return worldCurrencies.filter(c =>
        c.code.toLowerCase().includes(lowerQuery) ||
        c.name.toLowerCase().includes(lowerQuery) ||
        c.nameTr.toLowerCase().includes(lowerQuery)
    );
};

// Find currency by code
export const findCurrencyByCode = (code: string): Currency | undefined => {
    return worldCurrencies.find(c => c.code.toLowerCase() === code.toLowerCase());
};
