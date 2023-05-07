require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");

console.log("fs - 파일 암호화 ");

// 암호화 함수
function encrypt(text, password) {
  const cipher = crypto.createCipher("aes-256-cbc", password);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

// 특정 단어 앞 부분만 암호화하는 함수
function encryptWords(filePath, password, searchingWord) {
  const fileContent = fs.readFileSync(filePath, "utf8");

  // 단어 찾기 및 암호화
  const encryptedContent = fileContent
    .split(" ")
    .map((word) => encryptWord(word, searchingWord, password))
    .join(" ");

  const encryptedFilePath = filePath + ".encrypted.txt";
  fs.writeFileSync(encryptedFilePath, encryptedContent, "utf8");
  console.log("파일이 암호화되었습니다.");
}

function encryptWord(word, searchString, password) {
  if (word.includes(searchString)) {
    const encryptedPrefix = encrypt(word, password);
    return encryptedPrefix;
  }
  return word;
}

// 환경 변수에서 시크릿한 정보 가져오기
const filePath = process.env.FILE_PATH; // 암호화할 파일 경로
const secretKey = process.env.MY_SECRET_KEY;
const searchWord = process.env.INCLUDE_STR; // 암호화에 사용할 비밀키

// 시크릿한 정보 사용 예시
console.log("My secret key:", secretKey);
console.log("FILE_PATH", filePath);
console.log("INCLUDE_STR", searchWord);

/* 테스트 코드 시작 */
const sentence =
  "5/7 - 집 -> 12k -> 농장 -> 12K -> 거래처0111암호11  -> 60K -> 화성어린이센터 -> 10k -> 전기트럭충전소 -> 60K -> 거래처02_11암호11 -> 42K -> 집";
const encryptedContent = sentence
  .split(" ")
  .map((word) => encryptWord(word, searchWord, secretKey))
  .join(" ");

console.log(encryptedContent);
/* 테스트 코드 끝 */

encryptWords(filePath, secretKey, searchWord);
