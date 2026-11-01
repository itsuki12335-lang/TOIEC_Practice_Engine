import { describe, expect, it } from "vitest";
import { Part } from "../../src/models/Entity/Part.js";
import { PartNumber } from "../../src/models/BaseEntity.js";

describe("Entity: Part", () => {
  it("chứa đầy đủ định nghĩa 7 Part chuẩn của TOEIC trong Part.FullPart", () => {
    const parts = [1, 2, 3, 4, 5, 6, 7] as PartNumber[];
    for (const num of parts) {
      const part = Part.FullPart[num];
      expect(part).toBeDefined();
      expect(part.number).toBe(num);
    }
  });

  it("cấu hình chuẩn cho từng Part về Section, số câu hỏi và nhóm", () => {
    expect(Part.FullPart[1]).toMatchObject({
      number: 1,
      section: "Listening",
      name: "Photographs",
      questionCount: 6,
      choiceCount: 4,
      hasGroup: false,
    });

    expect(Part.FullPart[2]).toMatchObject({
      number: 2,
      section: "Listening",
      name: "Question - Response",
      questionCount: 25,
      choiceCount: 3,
      hasGroup: false,
    });

    expect(Part.FullPart[3]).toMatchObject({
      number: 3,
      section: "Listening",
      name: "Short Conversations",
      questionCount: 39,
      choiceCount: 4,
      hasGroup: true,
    });

    expect(Part.FullPart[4]).toMatchObject({
      number: 4,
      section: "Listening",
      name: "Short Talks",
      questionCount: 30,
      choiceCount: 4,
      hasGroup: true,
    });

    expect(Part.FullPart[5]).toMatchObject({
      number: 5,
      section: "Reading",
      name: "Incomplete Sentences",
      questionCount: 30,
      choiceCount: 4,
      hasGroup: false,
    });

    expect(Part.FullPart[6]).toMatchObject({
      number: 6,
      section: "Reading",
      name: "Text Completion",
      questionCount: 16,
      choiceCount: 4,
      hasGroup: true,
    });

    expect(Part.FullPart[7]).toMatchObject({
      number: 7,
      section: "Reading",
      name: "Reading Comprehension",
      questionCount: 54,
      choiceCount: 4,
      hasGroup: true,
    });
  });

  it("tổng số câu hỏi chuẩn TOEIC là 200 (100 Listening, 100 Reading)", () => {
    let lisCount = 0;
    let readCount = 0;

    for (const part of Object.values(Part.FullPart)) {
      if (part.section === "Listening") {
        lisCount += part.questionCount;
      } else {
        readCount += part.questionCount;
      }
    }

    expect(lisCount).toBe(100);
    expect(readCount).toBe(100);
    expect(lisCount + readCount).toBe(200);
  });
});
