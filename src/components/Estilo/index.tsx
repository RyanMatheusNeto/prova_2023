import "./styles.css";
export type SquareValue = "X" | "O" | null;

type SquareProps = {
  value: SquareValue,
  onSquareClick: () => void,
}
  
export function Square({ value, onSquareClick }: SquareProps){
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}