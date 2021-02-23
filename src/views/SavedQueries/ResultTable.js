import { Table } from 'react-bootstrap';
import React from 'react';
import styled from 'styled-components';


const TableStyled = styled.div`
margin-bottom: 20%;
margin-top: 5%;
.ExcelTable2007 {
	border: 1px solid #B0CBEF;
	border-width: 1px 0px 0px 1px;
	font-size: 11pt;
	font-family: Calibri;
	font-weight: 100;
	border-spacing: 0px;
	border-collapse: collapse;
}

.ExcelTable2007 TH {
	background-image: url(excel-2007-header-bg.gif);
	background-repeat: repeat-x; 
	font-weight: normal;
	font-size: 14px;
	border: 1px solid #9EB6CE;
	border-width: 0px 1px 1px 0px;
	height: 17px;
}

.ExcelTable2007 TD {
	border: 0px;
	background-color: white;
	padding: 0px 4px 0px 2px;
	border: 1px solid #D0D7E5;
	border-width: 0px 1px 1px 0px;
}

.ExcelTable2007 TD B {
	border: 0px;
	background-color: white;
	font-weight: bold;
}

.ExcelTable2007 TD.heading {
	background-color: #E4ECF7;
	text-align: center;
	border: 1px solid #9EB6CE;
	border-width: 0px 1px 1px 0px;
}

.ExcelTable2007 TH.heading {
	background-image: url(excel-2007-header-left.gif);
	background-repeat: none;
}
`;

const ResultTable = (props) => {
    const data = (props.results && props.results.rows || []).map((r) => r.data);
    const metadata = (props.results && props.results.metadata && props.results.metadata || []).map((c) => c.Name);

    return (
        <TableStyled className={''}>
            <Table className={'ExcelTable2007'} size={'sm'} hover border>
                <thead>
                    <tr>
                        {
                            metadata.map((c) => (
                                <th>
                                    {c}
                                </th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((r) => (
                            <tr>
                                {
                                    r.map((v) => <td>{v}</td>)
                                }
                            </tr>
                        ))
                    }

                </tbody>

            </Table>
        </TableStyled>
    );
};


export default ResultTable;
