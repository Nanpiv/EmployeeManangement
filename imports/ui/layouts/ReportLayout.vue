<template>
  <!--REPORT-->
  <q-card
    class="report-card"
    :style="{ visibility: trigger ? 'hidden' : 'visible' }"
  >
    <!--REPORT TOOLS-->
    <q-card-section class="header">
      <div
        v-if="!visiblePrintInvoice"
        class="card-header"
      >
        <div class="header-left">
          <!--Show Part-->
          <q-btn
            color="primary"
            icon="fa-solid fa-eye"
            label="Show"
            flat
            size="sm"
          >
            <q-menu>
              <q-list
                v-for="(val, key) in showPart"
                :key="key"
                style="min-width: 100px"
              >
                <q-item clickable>
                  <q-checkbox
                    v-model="showPart[key]"
                    size="xs"
                    :val="key"
                    :label="key"
                  />
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <!--Show Page Size -->
          <q-btn
            v-if="showPaperConfig && paperOpts"
            color="primary"
            icon="fa-solid fa-sticky-note"
            label="Paper Size"
            flat
            size="sm"
          >
            <q-menu>
              <q-list
                v-for="(val, key) in paperOpts"
                :key="key"
                style="min-width: 100px"
              >
                <q-item clickable>
                  <q-radio
                    v-model="paper"
                    :label="val.label"
                    :val="val.value"
                  />
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <!--Show Column Part -->
          <q-btn
            v-if="columns.length"
            color="primary"
            icon="fa-solid fa-table"
            label="Columns"
            flat
            size="sm"
          >
            <q-menu>
              <q-list style="min-width: 100px">
                <!-- v-close-popup -->
                <q-item clickable>
                  <q-option-group
                    :model-value="checkedColumns"
                    :options="columns"
                    type="checkbox"
                    size="xs"
                    @update:model-value="changeVal"
                  />
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>

        <!-- Print Tool -->
        <div class="header-right">
          <!-- <q-btn
            color="primary"
            flat
            size="sm"
            icon="fal fa-file-excel"
            label="Export Excel"
            @click="exportTableToCSV(reportTitle + '.xls')"
          >
          </q-btn> -->

          <q-btn
            color="primary"
            flat
            size="sm"
            icon="fa-solid fa-print"
            @click="$_printReport"
          >
          </q-btn>
          <!-- <q-btn
            color="primary"
            flat
            size="sm"
            icon="fal fa-copy"
            @click="$_copyReport"
            label="Copy"
          >
          </q-btn> -->
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <!-- <div class="q-pb-xs" /> -->

    <!--REPORT BODY-->
    <div id="exportTable">
      <div
        id="print-area"
        :class="'report-body ' + usePaper"
        style="margin: 0 auto"
      >
        <!--REPORT HEADER-->
        <div
          v-if="showPart.header"
          class="header"
        >
          <div class="company-name kh-moul">
            {{ company.name }}
          </div>
          <slot name="header" />
        </div>

        <!--REPORT FILTER-->
        <div
          v-if="showPart.filter"
          class="filter"
        >
          <slot name="filter" />
        </div>

        <!--REPORT CONTENT-->
        <div
          v-if="showPart.content"
          class="content"
        >
          <slot />
        </div>

        <!--REPORT TIMESTAMP-->
        <div
          v-if="showPart.timestamp"
          class="timestamp"
        >
          By {{ userFullName }}, {{ timestamp }}
          <span v-if="execTime"> ({{ execTime }} sec.) </span>
        </div>

        <!--REPORT FOOTER-->
        <div
          v-if="showPart.footer"
          class="footer"
        >
          <div>
            <div>
              <slot name="footer" />
            </div>
          </div>
        </div>

        <!--REPORT SIGNATURE-->
        <div
          v-if="showPart.signature"
          class="signature"
        >
          <!-- :gutter="10" -->
          <div
            class="row"
            type="flex"
            justify="space-around"
          >
            <div class="col colspan-8">Approved</div>
            <div class="col colspan-8">Verified</div>
            <div class="col colspan-8">Prepared</div>
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script lang="ts" setup>
import { has } from 'lodash'
import moment from 'moment'
import { useStore } from '/imports/store'
import { Printd } from 'printd'
import { computed, ref, watch } from 'vue'

// Copy
// import { copyText } from 'vue3-clipboard'
// CSV Export
// import csvExportMixin from '/imports/client/mixins/csv-export'
import cssPrinting from '/imports/ui/styles/report.css.js'

const store = useStore()
type IShow = {
  header: boolean
  filter: boolean
  content: boolean
  footer: boolean
  signature: boolean
  timestamp: boolean
}
const props = withDefaults(
  defineProps<{
    execTime?: number
    showPaperConfig?: boolean
    paperSize?: string
    paperOpts?: { label: string; value: string }[]
    reportTitle?: string
    cssText?: string
    trigger?: boolean
    show?: IShow
    // show column
    columns?: { label: string; value: string }[]
    activeColumns?: string[]
    comUsed?: string
    visiblePrintInvoice?: boolean
  }>(),
  {
    execTime: 0,
    showPaperConfig: false,
    paperSize: 'a4-p',
    paperOpts: () => [
      { label: 'A4 Portrait', value: 'a4-p' },
      { label: 'A4 Landscape', value: 'a4-l' },
      { label: 'A5 Portrait', value: 'a5-p' },
      { label: 'A5 Landscape', value: 'a5-l' },
      { label: 'A6 Portrait', value: 'a6-p' },
      { label: 'A6 Landscape', value: 'a6-l' },
    ],
    reportTitle: 'download',
    cssText: '',
    trigger: false,
    show: () => {
      return {
        header: true,
        filter: true,
        content: true,
        footer: true,
        signature: false,
        timestamp: true,
      }
    },
    columns: () => [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C' },
    ],
    activeColumns: () => ['A'],
    comUsed: 'Report',
    visiblePrintInvoice: false,
  }
)

const emit = defineEmits<{
  (e: 'beforeprint'): void
  (e: 'afterprint'): void
  (e: 'changeColumn', value: string[]): void
}>()

const paper = ref('a4-p')
const showPart = ref<any>({
  header: true,
  filter: true,
  content: true,
  footer: true,
  signature: false,
  timestamp: true,
})
const checkedColumns = ref<any>(props.activeColumns)
const timestamp = moment().format('ddd DD/MM/YYYY HH:mm:ss')
const d = new Printd()
const cssTextPrinting = cssPrinting + props.cssText

const company = computed(() => {
  const company = { general: { name: '...' } }

  return store.state.app.company || company
})

const userFullName = computed(() => {
  return store.getters['app/userFullName']
})

const usePaper = computed(() => {
  if (!props.showPaperConfig) {
    // return this.paperSize
    if (props.comUsed == 'Invoice') {
      return 'in-' + props.paperSize
    } else {
      return props.paperSize
    }
  }
  return paper
})

const $_printReport = () => {
  // Reference : https://github.com/joseluisq/printd/issues/3#issuecomment-526162841
  // Loading fonts, images
  const callback = ({
    window,
    document,
    element,
    launchPrint,
  }: {
    window?: any
    document?: any
    element?: any
    launchPrint?: any
  }): void => {
    setTimeout(() => launchPrint(window), 500)
  }

  // First call print
  d.print(
    document.getElementById('print-area') as HTMLElement,
    [
      `
            svg{
              margin-bottom: 0px;
            }
            .card-title {
              text-align: center
              // margin: 15px 0px 0px 0px;
              line-height: 18px;
              font-size: 14px
            }
          `,
      cssTextPrinting,
    ],
    [],
    callback
  )
  // then add your event handlers
  const { contentWindow } = d.getIFrame()
  if (contentWindow) {
    contentWindow.addEventListener('beforeprint', () => {
      emit('beforeprint')
    })
    contentWindow.addEventListener('afterprint', () => {
      emit('afterprint')
    })
  }
}

// const $_copyReport = () => {
//   const doc: HTMLElement | null = document.querySelector('#print-area')
//   copyText(doc?.innerText, undefined, (error: any) => {
//     if (error) {
//       console.log('copy report error:', error)
//     } else {
//       store.dispatch('app/message', {
//         type: 'success',
//         message: `You just copied`,
//       })
//     }
//   })
// }

const changeVal = (val: any) => {
  checkedColumns.value = val
  emit('changeColumn', val)
}

watch(
  () => props.trigger,
  (val) => {
    if (val) {
      $_printReport()
    }
  }
)

watch(
  () => props.show,
  (val) => {
    showPart.value = {
      header: has(val, 'header') ? val?.header : true,
      filter: has(val, 'filter') ? val?.filter : true,
      content: has(val, 'content') ? val?.content : true,
      footer: has(val, 'footer') ? val?.footer : true,
      signature: has(val, 'signature') ? val?.signature : false,
      timestamp: has(val, 'timestamp') ? val?.timestamp : true,
    }
  },
  {
    deep: true,
  }
)
</script>

<style lang="scss" scoped>
@import './imports/ui/styles/report.scss';

#exportTable {
  padding: 10px;
}
.in-a4-p {
  width: 21cm;
}

.in-a4-l {
  width: 29.7cm;
}

.in-a5-p {
  width: 14.8cm;
}

.in-a5-l {
  width: 21cm;
}

.in-a6-p {
  width: 10.5cm !important;
}

.in-a6-l {
  width: 18.9cm;
}

.in-mini {
  width: 8cm;
}
/* END USE FOR PRINT INVOICE ONLY*/
</style>
