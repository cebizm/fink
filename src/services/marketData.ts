// import { InvestmentType } from '../types'; // Removed unused import

export interface MarketRates {
    USD: number;
    EUR: number;
    gold: number; // Gram Altın in TRY
    lastUpdated: number;
}

const FRANKFURTER_API = 'https://api.frankfurter.app/latest';
// Public endpoint often used for spot prices. If this fails, we can add more fallbacks.
const GOLD_API = 'https://data-asg.goldprice.org/dbXRates/USD';

export const fetchMarketRates = async (): Promise<MarketRates> => {
    try {
        // 1. Fetch Currency Rates (USD/TRY, EUR/TRY)
        // We fetch base TRY to get the inverse, or base USD.
        // Frankfurter is free and stable.
        const currencyPromise = fetch(`${FRANKFURTER_API}?from=TRY&to=USD,EUR`)
            .then(res => res.json())
            .then(data => {
                // data.rates.USD is how many USD for 1 TRY. So 1 TRY = 0.03 USD.
                // We need TRY per USD. So 1 / rate.
                return {
                    USD: 1 / data.rates.USD,
                    EUR: 1 / data.rates.EUR
                };
            });

        // 2. Fetch Gold Spot Price (XAU/USD)
        const goldPromise = fetch(GOLD_API)
            .then(res => res.json())
            .then(data => {
                // data.items[0].xauPrice is usually the spot price per ounce
                return data.items?.[0]?.xauPrice || 0;
            })
            .catch(() => 0); // Fallback to 0 if fails

        const [currencies, xauUsd] = await Promise.all([currencyPromise, goldPromise]);

        // 3. Calculate Gram Gold TRY
        // Formula: (XAU/USD * USD/TRY) / 31.1035
        let gramGoldTry = 0;
        if (xauUsd > 0 && currencies.USD > 0) {
            gramGoldTry = (xauUsd * currencies.USD) / 31.1035;
        }

        return {
            USD: currencies.USD,
            EUR: currencies.EUR,
            gold: gramGoldTry,
            lastUpdated: Date.now()
        };

    } catch (error) {
        console.error("Market data fetch failed:", error);
        throw new Error("Piyasa verileri alınamadı.");
    }
};
