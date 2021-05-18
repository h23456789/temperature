const FormAutoFill = new Vue({
  el: '#app',
  data: {

    // Google Apps Script 部署為網路應用程式後的 URL
    gas: 'https://script.google.com/macros/s/AKfycbwf5iDQn7dhHGzC0JU8OGmZHm86KFNexW4c02MtvkZlGhes-1oHZeS-edHTQs6BC11yUw/exec',

    id: '',

    // 避免重複 POST，存資料用的
    persons: {},

    // 頁面上吐資料的 data
    person: {
		id: null,
		name: null,
		department: null,
		temperature: 0,
		children: 0,
		msg: null,
	},

    // Google Form 的 action URL
    formAction: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSfL6CyAosQfTJFmAxx6KvBaqmVRopj7PLKql4UYEjMSGdsPbg/formResponse',
    
    // Google Form 各個 input 的 name
    input: {
		id: 'entry.664306583',
		name: 'entry.325892444',
		department: 'entry.849213836',
		temperature: 'entry.1959743843',
		children: 'entry.1632268287',
		msg: 'entry.227625460',
    },

    // loading 效果要不要顯示
    loading: false,
	temputares:['否，我沒發燒','是，我發燒了或不舒服(請盡快就診並通知主管！)'],
	children:['無','有']

  },
  mounted(){
  },
  methods: {
    // ID 限填 4 碼
    limitIdLen(val) {
      if(val.length > 4) {
        return this.id =  this.id.slice(0, 4);
      }
    },
    // 送出表單
    submit() {
      // 再一次判斷是不是可以送出資料
      if(this.person.name !== undefined) {
        let params = `${this.input.id}=${this.person.id}&${this.input.name}=${this.person.name}&${this.input.department}=${this.person.department}&${this.input.temperature}=${this.temputares[this.person.temperature]}&${this.input.children}=${this.children[this.person.children]}&${this.input.msg}=${this.person.msg ? this.person.msg : '無'}`;
		console.log(this.formAction + '?' + params)
		fetch(this.formAction + '?' + params, {
          method: 'POST'
        }).catch(err => {
            alert('提交成功。');
            this.id = '';
            this.person = {};
          })
      }
    }
  },
  watch: {
    id: function(val) {
      // ID 輸入到 4 碼就查詢資料
      if(val.length === 4) {

        // this.persons 裡沒這筆資料，才 POST
        if(this.persons[this.id] === undefined) {
          this.loading = true;
          let uri = this.gas + '?id=' + this.id;
          fetch(uri, {
            method: 'POST'
          }).then(res => res.json())
            .then(res => {
              this.persons[this.id] = res; // 把這次查詢的 id 結果存下來
              this.person = res;
			  this.person.temperature = 0;
			  this.person.children = 0;
              this.loading = false;
            })
        }
        // this.persons 裡有資料就吐資料
        else {
          this.person = this.persons[this.id];
			  this.person.temperature = 0;
			  this.person.children = 0;
        }
		
      }
    }
  }
})