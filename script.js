// ── Tree helpers ─────────────────────────────────────────────────
function collapseSubtree(node) {
  if (node.children) {
    node.children.forEach(collapseSubtree);
    const all = node._initHidden
      ? [...node.children, ...node._initHidden]
      : node.children;
    node._children = all;
    node.children = null;
    node._initHidden = null;
  }
}

function expandLeftmostPathOnly(node) {
  const allChildren = node._children || node.children;
  if (!allChildren || allChildren.length === 0) return;
  if (node._children) {
    node.children = node._children;
    node._children = null;
    const first = node.children[0];
    const firstHasDepth = !!(first._children || first.children);
    if (firstHasDepth && node.children.length > 1) {
      node._initHidden = node.children.slice(1);
      node.children = [node.children[0]];
    }
  }
  expandLeftmostPathOnly(node.children[0]);
}

// ── Tooltip ──────────────────────────────────────────────────────
const tooltipEl = document.getElementById("tooltip");

function tooltipContent(d) {
  if (d.depth === 0) {
    return `<span class="tip-action">電吉他學習路徑</span>`;
  }
  if (d._children) {
    const kids = d._children.map(c => c.data.name);
    const shown = kids.slice(0, 4).join('<br>');
    const more  = kids.length > 4 ? `<br><span style="color:#667">+${kids.length - 4} 更多…</span>` : '';
    return `<div class="tip-action">▲ 點擊展開</div><div class="tip-items">${shown}${more}</div>`;
  }
  if (d.children) {
    const total = d.children.length + (d._initHidden ? d._initHidden.length : 0);
    return `<div class="tip-action">▼ 點擊收起</div><div class="tip-items" style="color:#667">${total} 個子項目</div>`;
  }
  if (d.data.url) {
    const hostname = new URL(d.data.url).hostname;
    const safe = d.data.name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `<div class="tip-action" style="color:#6DCF70">點擊前往</div><div class="tip-leaf">${safe}</div><div class="tip-items" style="margin-top:4px;color:#667">${hostname}</div>`;
  }
  const safe = d.data.name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  return `<div class="tip-leaf">${safe}</div>`;
}

function showTooltip(event, d) {
  tooltipEl.innerHTML = tooltipContent(d);
  const borderColor = d.depth === 0 ? '#ffcc99'
    : d._children ? '#FF6644'
    : d.children  ? '#6677EE'
    : '#44BB44';
  tooltipEl.style.borderColor = borderColor;
  tooltipEl.style.display = 'block';
  moveTooltip(event);
}

function moveTooltip(event) {
  const x = Math.min(event.clientX + 16, window.innerWidth  - 240);
  const y = Math.max(event.clientY - 52, 8);
  tooltipEl.style.left = x + 'px';
  tooltipEl.style.top  = y + 'px';
}

function hideTooltip() {
  tooltipEl.style.display = 'none';
}

// ── Text wrap ────────────────────────────────────────────────────
function wrapText(selection) {
  selection.each(function(d) {
    const el    = d3.select(this);
    const r     = nodeRadius(d);
    const chars = [...d.data.name];
    // 純中文 → 5 字換行；含英文/數字（含中英混合）→ 10 字換行
    const hasLatinOrNum = /[A-Za-z0-9]/.test(d.data.name);
    const MAX = hasLatinOrNum ? 10 : 5;

    el.text(null);

    const lines = [];
    for (let i = 0; i < chars.length; i += MAX) {
      lines.push(chars.slice(i, i + MAX).join(""));
    }

    lines.forEach((line, i) => {
      el.append("tspan")
        .attr("x", 0)
        .attr("dy", i === 0 ? r + 14 : "1.3em")
        .text(line);
    });
  });
}

// ── Config ────────────────────────────────────────────────────────
const LEVEL_H = 112;
const NODE_W  = 84;
const margin  = {
  top:    70,
  right:  80,
  bottom: Math.round(window.innerHeight * 0.1),
  left:   80
};

const LINK_COLORS = [
  'rgba(255,107,53,0.55)',
  'rgba(80,100,210,0.50)',
  'rgba(46,140,50,0.45)',
  'rgba(180,140,40,0.45)',
  'rgba(60,100,140,0.40)',
  'rgba(120,70,120,0.40)',
];

function nodeRadius(d) {
  return d.depth === 0 ? 11 : d.depth === 1 ? 8 : 6;
}

function nodeClass(d) {
  if (d.depth === 0) return "node n-root";
  if (d._children)   return "node n-collapsed";
  if (d.children)    return "node n-expanded";
  return d.data.url ? "node n-leaf-link" : "node n-leaf";
}

// ── D3 setup ─────────────────────────────────────────────────────
const svg       = d3.select("#tree-svg");
const gMain     = svg.append("g");

const treeLayout = d3.tree().nodeSize([NODE_W, LEVEL_H]);

let root = d3.hierarchy(data);
let uid  = 0;
root.each(d => { d.uid = uid++; });

root.each(d => {
  if (d.depth > 1 && d.children) {
    d._children = d.children;
    d.children  = null;
  }
});

expandLeftmostPathOnly(root);

function diagonal(link) {
  const sx = link.source.x, sy = -link.source.y;
  const tx = link.target.x, ty = -link.target.y;
  const my = (sy + ty) / 2;
  return `M${sx},${sy} C${sx},${my} ${tx},${my} ${tx},${ty}`;
}

// ── Update ───────────────────────────────────────────────────────
let prevSvgH = 0;
let isInit   = true;

function update(source) {
  treeLayout(root);

  const nodes = root.descendants();
  const links = root.links();

  const xs   = nodes.map(d => d.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...nodes.map(d => d.y));

  const treeSpanW = maxX - minX;
  const svgW      = Math.max(treeSpanW + margin.left + margin.right, window.innerWidth);
  // SVG is at least viewport-tall so root starts at bottom 10% even when tree is small
  const svgH      = Math.max(maxY + margin.top + margin.bottom, window.innerHeight);

  svg.attr("width", svgW).attr("height", svgH);

  const gX = (svgW - treeSpanW) / 2 - minX;
  const gY = svgH - margin.bottom;
  gMain.attr("transform", `translate(${gX},${gY})`);

  // Keep root at same viewport position when tree grows or shrinks
  const delta = svgH - prevSvgH;
  prevSvgH = svgH;
  if (!isInit && delta !== 0) {
    requestAnimationFrame(() => {
      window.scrollBy({ top: delta, behavior: 'instant' });
    });
  }

  // ── Links ─────────────────────────────────────────────────────
  const link = gMain.selectAll(".link").data(links, d => d.target.uid);

  link.enter()
    .insert("path", ".node")
    .attr("class", "link")
    .attr("stroke", d => LINK_COLORS[d.source.depth % LINK_COLORS.length])
    .attr("d", () => {
      const o = { x: source.x0 ?? 0, y: source.y0 ?? 0 };
      return diagonal({ source: o, target: o });
    })
    .merge(link)
    .transition().duration(380)
    .attr("d", diagonal);

  link.exit()
    .transition().duration(380)
    .attr("d", () => {
      const o = { x: source.x, y: source.y };
      return diagonal({ source: o, target: o });
    })
    .remove();

  // ── Nodes ─────────────────────────────────────────────────────
  const node = gMain.selectAll(".node").data(nodes, d => d.uid);

  const nodeEnter = node.enter()
    .append("g")
    .attr("class", nodeClass)
    .attr("transform", `translate(${source.x0 ?? 0},${-(source.y0 ?? 0)})`)
    .on("click", (event, d) => {
      if (!d.children && !d._children && d.data.url) {
        hideTooltip();
        window.open(d.data.url, '_blank');
        return;
      }
      if (d.children) {
        collapseSubtree(d);
      } else if (d._children) {
        d.children = d._children;
        d._children = null;
      }
      hideTooltip();
      update(d);
    });

  nodeEnter.append("circle").attr("r", d => nodeRadius(d));

  nodeEnter.append("text")
    .attr("text-anchor", "middle")
    .call(wrapText);

  const nodeUpdate = nodeEnter.merge(node);

  nodeUpdate
    .on("mouseover", showTooltip)
    .on("mousemove", (event) => moveTooltip(event))
    .on("mouseout",  hideTooltip);

  nodeUpdate
    .transition().duration(380)
    .attr("class",     nodeClass)
    .attr("transform", d => `translate(${d.x},${-d.y})`);

  nodeUpdate.select("circle").attr("r", d => nodeRadius(d));
  nodeUpdate.select("text").call(wrapText);

  node.exit()
    .transition().duration(380)
    .attr("transform", `translate(${source.x},${-source.y})`)
    .style("opacity", 0)
    .remove();

  nodes.forEach(d => { d.x0 = d.x; d.y0 = d.y; });

  // First render: position so root sits at bottom 10% of viewport
  if (isInit) {
    isInit = false;
    const initSvgH = svgH;
    requestAnimationFrame(() => {
      window.scrollTo({ top: Math.max(0, initSvgH - window.innerHeight), behavior: 'instant' });
    });
  }
}

update(root);

// ── Expand / Collapse All Button ─────────────────────────────────
function expandAll(node) {
  if (node._children) {
    node.children = node._children;
    node._children = null;
  }
  if (node._initHidden) {
    node.children = node.children
      ? [...node.children, ...node._initHidden]
      : [...node._initHidden];
    node._initHidden = null;
  }
  if (node.children) node.children.forEach(expandAll);
}

function collapseAll(node) {
  const allChildren = [
    ...(node.children || []),
    ...(node._initHidden || []),
    ...(node._children || [])
  ];
  allChildren.forEach(collapseAll);
  if (node.depth > 0 && allChildren.length > 0) {
    node._children = allChildren;
    node.children = null;
    node._initHidden = null;
  }
}

let allExpanded = false;

document.getElementById('expand-toggle').addEventListener('click', () => {
  if (allExpanded) {
    collapseAll(root);
    allExpanded = false;
    document.getElementById('expand-toggle').textContent = '⊞ 展開全部';
  } else {
    expandAll(root);
    allExpanded = true;
    document.getElementById('expand-toggle').textContent = '⊟ 收合全部';
  }
  update(root);
});
