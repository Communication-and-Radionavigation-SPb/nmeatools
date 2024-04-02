import * as nmea from "../checksum";
import { describe, expect, test } from "@jest/globals";
import { faker } from "@faker-js/faker";

describe("NMEA Sentence Validation test suite.", () => {
  const goodSentences: string[] = [
    "$GPRMC,113792.134,A,8500.0,N,13830.0,W,8.5,15.0,181023,,,*00",
    "[pre,1,2,fix]$GPRMC,105441.518,A,3100.0,N,13830.0,E,2.1,15.0,181023,,,*13",
    "<prefixed>$SDDBK,55.1,f,2.0,M,4.4,F*2A",
    "/prefix/$HEROT,5.6,A*28",
  ];

  const badSentences: string[] = [
    "GPRMC,113792.134,A,8500.0,N,13830.0,W,8.5,15.0,181023,,,*00",
    "$",
    "[pre,1,2,fix]GPRMC,105441.518,A,3100.0,N,13830.0,E,2.1,15.0,181023,,,*13",
    faker.string.alphanumeric({ length: 32 }),
    "",
  ];

  test("Validates good samples.", () => {
    goodSentences.forEach((sentence) => {
      expect(nmea.validate(sentence)).toBeTruthy();
    });
  });

  test("Invalidates bad samples.", () => {
    badSentences.forEach((sentence) => {
      expect(nmea.validate(sentence)).toBeFalsy();
    });
  });
});

type ChecksumTestSample = {
  sentence: string;
  checksum: string;
};

describe("NMEA Sentence Checksum calculation test suite.", () => {
  const samples: ChecksumTestSample[] = [
    {
      sentence: "prefix$SDDBK,38.1,f,8.0,M,4.4,F*2B",
      checksum: "2B",
    },
    {
      sentence: "pref1x$SDDBK,38.1,f,8.0,M,4.4,F",
      checksum: "2B",
    },
    {
      sentence: "<S16$SDDBK,82.0,f,8.0,M,4.4,F",
      checksum: "2B",
    },
    {
      sentence:
        "[1,1,2,]$GPRMC,144375.797,A,1600.0,N,13830.0,E,9.2,15.0,181023,,,",
      checksum: "1E",
    },
  ];

  test("Calculates checksum correctly.", () => {
    samples.forEach((sample) => {
      expect(
        nmea.calculateChecksum(sample.sentence).toString(16).toUpperCase()
      ).toStrictEqual(sample.checksum);
    });
  });
});
