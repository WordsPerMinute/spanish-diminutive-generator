import { FaMugHot } from "react-icons/fa";
import "./BuyMeACoffee.scss";

function BuyMeACoffee() {
  return (
    <a
      href="https://buymeacoffee.com/wordsperminute"
      target="_blank"
      rel="noopener noreferrer"
      className="bmc-button"
    >
      <FaMugHot />
      <span>Buy me a coffee</span>
    </a>
  );
}

export default BuyMeACoffee;
