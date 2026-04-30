/**
-- 경기도 내 지역에 관련된 Create Sql
CREATE TABLE cities (
  code VARCHAR(10) PRIMARY KEY,
  ko_txt VARCHAR(50) NOT NULL,
  region VARCHAR(10) NOT NULL
);
*/

export const citiesResponse = {
  timestamp: "2026-04-30T14:23:45",
  status: "success",
  httpCode: 200,
  message: "ok",
  path: null,
  data: [
    { code: "41110", koTxt: "수원시", region: "south" },
    { code: "41130", koTxt: "성남시", region: "south" },
    { code: "41460", koTxt: "용인시", region: "south" },
    { code: "41170", koTxt: "안양시", region: "south" },
    { code: "41270", koTxt: "안산시", region: "south" },
    { code: "41290", koTxt: "과천시", region: "south" },
    { code: "41210", koTxt: "광명시", region: "south" },
    { code: "41610", koTxt: "광주시", region: "south" },
    { code: "41410", koTxt: "군포시", region: "south" },
    { code: "41190", koTxt: "부천시", region: "south" },
    { code: "41390", koTxt: "시흥시", region: "south" },
    { code: "41550", koTxt: "안성시", region: "south" },
    { code: "41370", koTxt: "오산시", region: "south" },
    { code: "41430", koTxt: "의왕시", region: "south" },
    { code: "41500", koTxt: "이천시", region: "south" },
    { code: "41220", koTxt: "평택시", region: "south" },
    { code: "41450", koTxt: "하남시", region: "south" },
    { code: "41590", koTxt: "화성시", region: "south" },
    { code: "41670", koTxt: "여주시", region: "south" },
    { code: "41830", koTxt: "양평군", region: "south" },

    { code: "41280", koTxt: "고양시", region: "north" },
    { code: "41310", koTxt: "구리시", region: "north" },
    { code: "41360", koTxt: "남양주시", region: "north" },
    { code: "41250", koTxt: "동두천시", region: "north" },
    { code: "41630", koTxt: "양주시", region: "north" },
    { code: "41150", koTxt: "의정부시", region: "north" },
    { code: "41480", koTxt: "파주시", region: "north" },
    { code: "41650", koTxt: "포천시", region: "north" },
    { code: "41800", koTxt: "연천군", region: "north" },
    { code: "41820", koTxt: "가평군", region: "north" }
  ]
};