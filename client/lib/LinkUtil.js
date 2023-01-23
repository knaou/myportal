export function copyLinkContent(src, dest) {
  dest._id = src._id || null;
  dest.image = src.image || null;
  dest.title = src.title || null;
  dest.description = src.description || null;
  dest.category = src.category || "default";
  dest.linkto = src.linkto || null;
  dest.enabled = src.enabled === undefined ? true : src.enabled;
  if (src.tags) {
    if (Array.isArray(src.tags)) {
      dest.tags = src.tags.reduce((ret, i) => {
        ret.push(i.toString());
        return ret;
      }, []);
    } else {
      dest.tags = [src.tags.toString()];
    }
  } else {
    dest.tags = [];
  }
}

export function normalizeLink(link) {
  const ret = { _id: (link && link._id) || null };
  copyLinkContent(link || {}, ret);
  return ret;
}
