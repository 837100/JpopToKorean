## 가사 TXT 변환

가사를 일반 TXT 형식으로 작성한 뒤 다음 명령을 실행합니다.

```bash
node tools/convertLyrics.js test.txt
```

같은 폴더에 `testToJson.txt`가 생성됩니다. 생성된 배열을 곡 JSON의 `lyricsLines` 값 뒤에 붙여 넣어 사용합니다.

```json
{
	"lyricsLines": [
		"生まれて目覚めて",
		"[우마레테 메자메테]",
		"태어나 눈떠",
		""
	]
}
```

