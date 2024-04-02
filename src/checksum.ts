export function validate(NMEASentence: string): boolean {
  if (!NMEASentence.includes("$")) {
    return false;
  }

  let parts: string[];
  parts = NMEASentence.split(/[\$\*]/);
  const payload = parts[1];
  const checksum = parts[2];

  if (!payload) {
    return false;
  }

  if (checksum && checksum.length !== 2) {
    return false;
  }

  return true;
}

export function calculateChecksum(NMEASentence: string) {
  const char_nums = extractPayload(NMEASentence)
    .split("")
    .slice(0)
    .map((element) => {
      var char_num = element.charCodeAt(0);
      if (char_num < 31 && char_num > 126) {
        return 0;
      }
      return char_num;
    })
    .filter((element) => {
      return element !== 0;
    });

  let result: number = char_nums[0] ^ char_nums[1];
  for (let idx = 2; idx < char_nums.length; idx++) {
    result ^= char_nums[idx];
  }

  return result;
}

function extractPayload(validNMEASentence: string): string {
  let parts: string[];
  parts = validNMEASentence.split(/[\$\*]/);
  return parts[1];
}
