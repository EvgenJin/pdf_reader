<template>
<div>

  <div v-for="item in items" :key="item.id">
    <a v-bind:href="'http://localhost:3000/book/'+item.name_tr">{{ item.name }}</a>
  </div>

</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      items: []
    }
  },
  methods: {
    link_to(target) {
      router.push('e1.ru')
    }
  },
  mounted() {
    // console.log("asda");
    fetch('http://localhost:3000/all')
    .then(res => res.json())
    .then(res => {
      res.forEach(el => {
        this.items.push(el)
      });
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
