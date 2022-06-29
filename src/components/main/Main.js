import React, { useState } from "react";
import "./Main.css";
import axios from 'axios';

export default function Main(props) {
    let obj ={};
    const [symbolName, setSymbolName] = useState('');
    const [errorMessage, setErrorMesssage] = useState('');
    const [incomeStatement, setIncomeStatement] = useState([]);
    const [balanceSheet, setBalanceSheet] = useState([]);
    const [financialData, setFinancialData] = useState([]);
    const [financialQuote, setFinancialQuote] = useState([]);
    const [cashflowStatement, setCashflowStatement] = useState([]);
    const [loading, setLoading] = useState(true);
    const keyParams = ["Margin", "Asset turnover", "Leverage", "Return on equity"]
    const overViewText = [
        "For every 1 rupee of sale, how much profit stakeholder is going to recieve", 
        "For every one rupee of asset , how much sale is happening", 
        "Lesser the Debts, good the value is.", 
        "Higher the ROE tells how effectively money is being used, prefer to have ROE > 18",
        "Higher ROCE implies the capital employment strategies of a company are more efficient",
        "The lower the EBIDTA, the cheaper is the valuation of the company",
        "Prefer to have PE Ratio > 30 and < 50, avoid if PE is too less (< 10)",
        "Prefer to have PB/V Ratio <= 1 with good fundamentals, if PB/V ratio is > 5 its over priced and better to avoid"
    ];

    const headers = {
      'X-API-KEY': '9vQkW0MSiK4eWLQxWk8ue8Rj36UCsleL2apsaGRr',
      'accept': 'application/json'
    }
    const options = (statement) => {
      if(statement){
        return {
          method: 'GET',
          url: `https://yfapi.net/v11/finance/quoteSummary/${symbolName+'.NS'}?lang=en&region=IN&modules=${statement}`,
          params: {symbol: symbolName, region: 'IN'},
          headers: headers
      }
    }

      return {
        method: 'GET',
        url: `https://yfapi.net/v6/finance/quote?region=IN&lang=en&symbols=${symbolName+'.NS'}`,
        params: {symbol: symbolName, region: 'IN'},
        headers: headers
      }};

      const fetchIncomeData = async () =>{
        setLoading(true);
        try {
          const {data: response} = await axios.request(options('incomeStatementHistory'));
          console.log("fetchIncomeData",  response);
          setIncomeStatement(response?.quoteSummary?.result[0]?.incomeStatementHistory?.incomeStatementHistory);
        } catch (error) {
          console.error(error.response.data.message);
          setErrorMesssage(error.response.data.message);
        }
        setLoading(false);
      }
      

      const fetchBalanceSheetData = async () =>{
        setLoading(true);
        try {
          const {data: response} = await axios.request(options('balanceSheetHistory'));
          console.log("fetchBalanceSheetData", response);
          setBalanceSheet(response?.quoteSummary?.result[0]?.balanceSheetHistory?.balanceSheetStatements);
        } catch (error) {
          console.error(error.message);
          setErrorMesssage(error.response.data.message);
        }
        setLoading(false);
      }

      const fetchFinancialData = async () =>{
        setLoading(true);
        try {
          const {data: response} = await axios.request(options('financialData'));
          console.log("fetchFinancialData", response);
          setFinancialData(response?.quoteSummary?.result[0]?.financialData);
        } catch (error) {
          console.error(error.message);
          setErrorMesssage(error.response.data.message);
        }
        setLoading(false);
      }

      const fetchCashflowData = async () =>{
        setLoading(true);
        try {
          const {data: response} = await axios.request(options('cashflowStatementHistory'));
          console.log("fetchCashflowData", response);
          setCashflowStatement(response?.quoteSummary?.result[0]?.cashflowStatementHistory?.cashflowStatements);
        } catch (error) {
          console.error(error.message);
          setErrorMesssage(error.response.data.message);
        }
        setLoading(false);
      }

      const fetchFinancialQuote = async () =>{
        setLoading(true);
        try {
          const {data: response} = await axios.request(options());
          console.log("fetchFinancialQuote", response);
          setFinancialQuote(response?.quoteResponse?.result[0]);
        } catch (error) {
          console.error(error.message);
          setErrorMesssage(error.response.data.message);
        }
        setLoading(false);
      }

    function handleSubmit(e) {
        e.preventDefault();
        fetchIncomeData();
        fetchBalanceSheetData();
        fetchFinancialData();
        fetchCashflowData();
        fetchFinancialQuote();
    }
        return (
          <div className="main">
              <style>
                  {`
                @media only screen and (min-device-width: 340px) and (max-device-width: 768px) {
                  table {
                    width: 100%;
                  }
                  input{
                    width: 70%;
                  }
                }
                
                @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
                  table {
                    width: 70%;
                  }
                  input{
                    width: 10%;
                  }
                }
              `}
              </style>
              <form onSubmit={handleSubmit}>
                  <div className="price-input">
                      <input
                          type="text"
                          value={symbolName}
                          placeholder="Enter Stock Symbol"
                          onChange={e => setSymbolName(e.target.value)}
                      />
                  </div>
                  <button type="submit">Submit</button>
              </form>

          {incomeStatement?.length > 0 && financialData && <div><table>
          <thead>
            <tr>
              <th></th>
              {
                  incomeStatement?.map((value,key) => {
                      return (
                      <th key={key}>{new Date(value?.endDate?.fmt).getFullYear()}</th>
                      )
                  })
              }
              <th>Comments</th>
            </tr>
          </thead>
              <tr>
                  <th>Margin</th>
                  {
                      incomeStatement?.map((value, key) => {
                          return (
                              <td>{((value?.netIncome?.raw / value?.totalRevenue?.raw) * 100).toFixed(2)}%</td>
                          )
                      })
                  }
                  <td>{overViewText[0]}</td>
              </tr>

              <tr>
                  <th>Asset turnover</th>
                  {
                      incomeStatement?.map((value, key) => {
                        let val = key+1;
                        if(incomeStatement[val]){
                          return (<td>{((value?.totalRevenue?.raw / ((balanceSheet[key]?.totalAssets?.raw+balanceSheet[key+1]?.totalAssets?.raw)/2))).toFixed(2)}</td>)
                      }
                          else return (
                              <td>{((value?.totalRevenue?.raw / balanceSheet[key]?.totalAssets?.raw)).toFixed(2)}</td>
                          )
                      })
                  }
                  <td>{overViewText[1]}</td>
              </tr>

              <tr>
                  <th>Financial Leverage</th>
                  {
                      incomeStatement?.map((value, key) => {

                        if(incomeStatement[key+1]){
                          return (<td>{((((balanceSheet[key]?.totalAssets?.raw+ balanceSheet[key+1]?.totalAssets?.raw)/2) / ((balanceSheet[key]?.totalStockholderEquity?.raw+balanceSheet[key+1]?.totalStockholderEquity?.raw)/2))).toFixed(2)}</td>)
                      }
                          else return (
                              <td>{((balanceSheet[key]?.totalAssets?.raw / balanceSheet[key]?.totalStockholderEquity?.raw)).toFixed(2)}</td>
                          )
                      })
                  }
                  <td>{overViewText[2]}</td>
              </tr>

              <tr>
                  <th>ROE</th>
                  {
                      incomeStatement?.map((value, key) => {
                        let val = key+1;
                          if(incomeStatement[val]){
                              return (<td>{((value?.netIncome?.raw / ((balanceSheet[key]?.totalStockholderEquity?.raw + balanceSheet[key+1]?.totalStockholderEquity?.raw)/2)) * 100).toFixed(2)} %</td>) 
                          }
                          else return (
                              <td>{((value?.netIncome?.raw / (balanceSheet[key]?.totalStockholderEquity?.raw + 0)/2) * 100).toFixed(2)}%</td>
                          )
                      })
                  }
                  <td>{overViewText[3]}</td>
              </tr>

              <tr>
                  <th>ROCE</th>
                  {
                      incomeStatement?.map((value, key) => {
                        let val = key+1;
                          return (
                              <td>{((value?.ebit?.raw/(balanceSheet[key]?.totalStockholderEquity?.raw + balanceSheet[key]?.longTermDebt?.raw))*100).toFixed(2)}%</td>
                              // <td>{((value?.ebit?.raw/(balanceSheet[key]?.totalAssets?.raw - balanceSheet[key]?.totalCurrentLiabilities?.raw))*100).toFixed(2)}%</td>
                          )
                      })
                  }
                  <td>{overViewText[4]}</td>
              </tr>

              <tr>
                  <th>EBITDA margin</th>
                  {
                      incomeStatement?.map((value, key) => {
                          return (
                              <td>{(((( value?.ebit?.raw + cashflowStatement[key]?.depreciation?.raw) / value?.totalRevenue?.raw)) * 100).toFixed(2)}%</td>
                          )
                      })
                  }
                  <td>{overViewText[5]}</td>
              </tr>

              <tr>
                  <th>PE Ratio</th>
                  {/* {
                      incomeStatement?.map((value, key) => {
                          return ( */}
                              <td>{(financialQuote?.regularMarketPrice / financialQuote?.epsTrailingTwelveMonths).toFixed(2)}</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                          {/* )
                      })
                  } */}
                  <td>{overViewText[6]}</td>
              </tr>

              <tr>
                  <th>P/BV Ratio</th>
                  {/* {
                      incomeStatement?.map((value, key) => {
                          return ( */}
                              <td>{(financialQuote?.regularMarketPrice / financialQuote?.bookValue).toFixed(2)}</td>
                              <td>-</td>
                              <td>-</td>
                              <td>-</td>
                          {/* )
                      })
                  } */}
                  <td>{overViewText[7]}</td>
              </tr>
        </table>
        <span>*ROE - Return on equity</span><br/>
        <span>*ROCE - Return on Capital Employed</span><br/>
        <span>*EBITDA - Earnings Before Interest, Taxes, Depreciation, and Amortization</span><br/>
        <span>*PE - Price Earning Ratio</span><br/>
        <span>*P/BV - Price-To-Book ratio</span><br/>
        </div>
        }

        {errorMessage!=='' && (<div><span>errorMessage</span></div>)}
          </div>
      );       
   
}
