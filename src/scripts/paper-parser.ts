export function parsePapers(mdContent: string) {
  const papers: any[] = [];
  const sections = mdContent.split(/^##\s+/m).filter(Boolean);

  sections.forEach(section => {
    const lines = section.split('\n');
    const title = lines[0].trim();
    const authorsMatch = section.match(/- 作者:\s*(.*)/);
    const journalMatch = section.match(/- 发表期刊\/会议:\s*(.*)/);
    const dateMatch = section.match(/- 发表时间:\s*(.*)/);
    const linkMatch = section.match(/- DOI\/链接:\s*(.*)/);
    const abstractMatch = section.match(/- 摘要:\s*(.*)/);

    papers.push({
      title,
      authors: authorsMatch ? authorsMatch[1].trim() : '',
      journal: journalMatch ? journalMatch[1].trim() : '',
      date: dateMatch ? dateMatch[1].trim() : '',
      link: linkMatch ? linkMatch[1].trim() : '',
      abstract: abstractMatch ? abstractMatch[1].trim() : ''
    });
  });

  return papers;
}
