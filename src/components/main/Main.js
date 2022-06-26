import React, { useState } from "react";
import "./Main.css";
import axios from 'axios';

export default function Main(props) {
    let obj ={};
    const [symbolName, setSymbolName] = useState('');
    const [incomeStatement, setIncomeStatement] = useState([]);
    const [balanceSheet, setBalanceSheet] = useState([]);
    const [loading, setLoading] = useState(true);
    const keyParams = ["Margin", "Asset turnover", "Leverage", "Return on equity"]
    const options = (statement) => {
        return {
        method: 'GET',
        url: `https://yfapi.net/v11/finance/quoteSummary/${symbolName+'.NS'}?lang=en&region=IN&modules=${statement}`,
        params: {symbol: symbolName, region: 'IN'},
        headers: {
          'X-API-KEY': '9vQkW0MSiK4eWLQxWk8ue8Rj36UCsleL2apsaGRr',
          'accept': 'application/json'
        }
      }};

      const fetchIncomeData = async () =>{
        setLoading(true);
        try {
          const {data: response} = await axios.request(options('incomeStatementHistory'));
          console.log("fetchIncomeData",  response);
          setIncomeStatement(response?.quoteSummary?.result[0]?.incomeStatementHistory?.incomeStatementHistory);
        } catch (error) {
          console.error(error.message);
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
        }
        setLoading(false);
      }

    function handleSubmit(e) {
        e.preventDefault();
        fetchIncomeData();
        fetchBalanceSheetData();
        console.log('You clicked submit.');
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
                        <span>Stock Symbol: </span>
                        <input
                            type="text"
                            value={symbolName}
                            placeholder=""
                            onChange={e => setSymbolName(e.target.value)}
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>

            {incomeStatement?.length > 0 && <table>
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
                </tr>

                <tr>
                    <th>Asset turnover</th>
                    {
                        incomeStatement?.map((value, key) => {
                            return (
                                <td>{((value?.totalRevenue?.raw / balanceSheet[key]?.totalAssets?.raw)).toFixed(2)}</td>
                            )
                        })
                    }
                </tr>

                <tr>
                    <th>Total Assets</th>
                    {
                        incomeStatement?.map((value, key) => {
                            return (
                                <td>{((balanceSheet[key]?.totalAssets?.raw / balanceSheet[key]?.totalStockholderEquity?.raw)).toFixed(2)}</td>
                            )
                        })
                    }
                </tr>

                <tr>
                    <th>ROE</th>
                    {
                        incomeStatement?.map((value, key) => {
                            if(false){
                                return (<td>{((value?.netIncome?.raw / (balanceSheet[key]?.totalStockholderEquity?.raw + balanceSheet[key+1]?.totalStockholderEquity?.raw)/2) * 100).toFixed(2)}</td>) 
                            }
                            return (
                                <td>{((value?.netIncome?.raw / (balanceSheet[key]?.totalStockholderEquity?.raw + 0)/2) * 100).toFixed(2)}%</td>
                            )
                        })
                    }
                </tr>

              {/* {
                incomeStatement?.map((value, key) => {
                  return (
                    <tr key={key}>
                        <th key={key}>{keyParams[key]}</th>
                        <td>{((value?.netIncome?.raw / value?.totalRevenue?.raw) * 100).toFixed(2)}%</td>
                        <td>{((value?.totalRevenue?.raw / balanceSheet[key]?.totalAssets?.raw)).toFixed(2)}</td>
                        <td>{((balanceSheet[key]?.totalAssets?.raw / balanceSheet[key]?.totalStockholderEquity?.raw)).toFixed(2)}</td>
                        {isNaN(balanceSheet[key+1]) && <td>{((value?.netIncome?.raw / (balanceSheet[key]?.totalStockholderEquity?.raw + balanceSheet[key+1]?.totalStockholderEquity?.raw)/2) * 100).toFixed(2)}</td>}
                    </tr>
                  )
                  })
                } */}
          </table>}
                
                {/* <p>Margin {parseFloat((netProfit / revenue) * 100).toFixed(2)}</p>
                <p>Asset Turnover {parseFloat(revenue / assets).toFixed(2)}</p>
                <p> Levarage {parseFloat(assets / equity).toFixed(2)}</p>
                <p>ROE {parseFloat(netProfit / equity).toFixed(2)}</p>
     */}
            </div>
        );
   
}
