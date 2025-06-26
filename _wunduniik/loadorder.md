---
layout: default
title: "Load Order"
permalink: /mods/
---

# Wunduniik Load Order

> This section shows you the exact content and order placement of Wunduniik's mods and plugins.  
> Click to expand or collapse.

<details>
  <summary><strong>Show / Hide plugins load order</strong></summary>

  ```text
  {% for plugin in site.data.loadorder %}
  {{ plugin }}
  {% endfor %}
```  
</details>

<details>
  <summary><strong>Show / Hide mod order</strong></summary>

  ```text
  {% for plugin in site.data.modlist %}
  {{ plugin }}
  {% endfor %}
```  
</details>
