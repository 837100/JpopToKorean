## 가사 TXT 변환

가사를 일반 TXT 형식으로 작성한 뒤 다음 명령을 실행합니다.

```bash
node convertLyrics.js test.txt
```

같은 폴더에 `testToJson.txt`가 생성됩니다. 생성된 내용은 곡 JSON의 `lyricsLines` 값으로 사용할 수 있습니다.

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

