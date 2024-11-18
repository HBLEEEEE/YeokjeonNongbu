import { Transaction } from '@/types/Index';

interface TransactionTableProps {
  displayedTransactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ displayedTransactions }) => {
  return (
    <table className="w-full text-xs border-collapse min-h-[194px]">
      <thead>
        <tr className="bg-light-pink text-center">
          <th className="p-2 border-b-2">시간</th>
          <th className="p-2 border-b-2">작물명</th>
          <th className="p-2 border-b-2">거래유형</th>
          <th className="p-2 border-b-2">수량</th>
          <th className="p-2 border-b-2">거래 가격</th>
          <th className="p-2 border-b-2">거래 총액</th>
        </tr>
      </thead>
      <tbody>
        {displayedTransactions.map((transaction, index) => (
          <tr key={index} className="text-center odd:bg-white even:bg-light-beige">
            <td className="p-2">{transaction.date || '\u00A0'}</td>
            <td className="p-2">{transaction.item || '\u00A0'}</td>
            <td className="p-2">{transaction.type || '\u00A0'}</td>
            <td className="p-2">{transaction.quantity !== 0 ? transaction.quantity : '\u00A0'}</td>
            <td className="p-2">{transaction.pricePerUnit || '\u00A0'}</td>
            <td className="p-2">{transaction.totalPrice || '\u00A0'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TransactionTable;
