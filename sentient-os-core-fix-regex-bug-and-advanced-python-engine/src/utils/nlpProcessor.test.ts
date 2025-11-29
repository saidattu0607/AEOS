import { describe, it, expect } from "bun:test";
import { extractEntities } from "./nlpProcessor";

describe("nlpProcessor", () => {
  describe("extractEntities", () => {
    it("should correctly extract integer ADA amounts", () => {
      const entities = extractEntities("Send 100 ADA");
      const amount = entities.find(e => e.type === 'amount');
      expect(amount).toBeDefined();
      expect(amount?.value).toBe("100 ADA");
    });

    it("should correctly extract decimal ADA amounts with leading zero", () => {
      const entities = extractEntities("Send 0.5 ADA");
      const amount = entities.find(e => e.type === 'amount');
      expect(amount).toBeDefined();
      expect(amount?.value).toBe("0.5 ADA");
    });

    it("should correctly extract decimal ADA amounts without leading zero", () => {
      // This is the failing test case
      const entities = extractEntities("Send .5 ADA");
      const amount = entities.find(e => e.type === 'amount');

      // Before fix, this might match "5 ADA" (incorrect) or nothing
      // We expect ".5 ADA"
      expect(amount).toBeDefined();
      expect(amount?.value).toBe(".5 ADA");
    });

    it("should handle mixed text", () => {
        const entities = extractEntities("Please transfer 100.50 ADA to my wallet");
        const amount = entities.find(e => e.type === 'amount');
        expect(amount?.value).toBe("100.50 ADA");
    });
  });
});
