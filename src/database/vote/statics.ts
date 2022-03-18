/* eslint-disable import/prefer-default-export */

export async function get(discordId) {
  return this.findOneAndUpdate(
    {
      discordId,
    },
    {},
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
}
