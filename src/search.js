import FlexSearch from "flexsearch";

export default FlexSearch.create({
  profile: "score",
  doc: {
    id: "id",
    field: ["artist", "title", "original_filename"],
    tag: "playlist",
  },
});
