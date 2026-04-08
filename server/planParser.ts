export interface PlanSection {
  id: string;
  heading: string;
  level: number;
  startLine: number;
  endLine: number;
  rawContent: string;
  children: PlanSection[];
}

export interface ParsedPlan {
  title: string;
  sections: PlanSection[];
  rawMarkdown: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function parsePlan(markdown: string): ParsedPlan {
  const lines = markdown.split('\n');
  const flatSections: PlanSection[] = [];
  let title = '';

  let currentSection: PlanSection | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const heading = headingMatch[2].trim();

      if (level === 1 && !title) {
        title = heading;
      }

      if (currentSection) {
        currentSection.endLine = i;
        currentSection.rawContent = lines
          .slice(currentSection.startLine, i)
          .join('\n');
      }

      currentSection = {
        id: slugify(heading) || `section-${i}`,
        heading,
        level,
        startLine: i,
        endLine: lines.length,
        rawContent: '',
        children: [],
      };

      flatSections.push(currentSection);
    }
  }

  if (currentSection) {
    currentSection.endLine = lines.length;
    currentSection.rawContent = lines
      .slice(currentSection.startLine)
      .join('\n');
  }

  // Build hierarchy: h3s become children of preceding h2, etc.
  const rootSections: PlanSection[] = [];
  const stack: PlanSection[] = [];

  for (const section of flatSections) {
    while (stack.length > 0 && stack[stack.length - 1].level >= section.level) {
      stack.pop();
    }

    if (stack.length > 0) {
      stack[stack.length - 1].children.push(section);
    } else {
      rootSections.push(section);
    }

    stack.push(section);
  }

  return {
    title: title || 'Untitled Plan',
    sections: rootSections,
    rawMarkdown: markdown,
  };
}
