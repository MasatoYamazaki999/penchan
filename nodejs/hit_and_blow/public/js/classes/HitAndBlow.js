class HitAndBlow {
  constructor() {
    // create 9 permutation 4 array
    const permutation = (nums, k) => {
      let result = [];
      if (nums.length < k) {
        return [];
      }
      if (k === 1) {
        for (let i = 0; i < nums.length; i++) {
          result[i] = [nums[i]];
        }
      } else {
        for (let i = 0; i < nums.length; i++) {
          let parts = nums.slice(0);
          parts.splice(i, 1)[0];
          let row = permutation(parts, k - 1);
          for (let j = 0; j < row.length; j++) {
            result.push([nums[i]].concat(row[j]));
          }
        }
      }
      return result;
    };
    this.all_array = permutation([1, 2, 3, 4, 5, 6, 7, 8, 9], 4);
  }
  getHitAndBlow(inp_num, target_num) {
    let hit = 0;
    let blow = 0;
    for (let i = 0; i < 4; i++) {
      // hit
      if (inp_num[i] == target_num[i]) {
        hit++;
      } else {
        // blow
        for (let j = 0; j < 4; j++) {
          if (i != j) {
            if (inp_num[i] == target_num[j]) {
              blow++;
            }
          }
        }
      }
    }
    return [hit, blow];
  }
}



