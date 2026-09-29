
<script setup>

    const play  = defineModel ('play', { type: Boolean, default: true })
    const props = defineProps (
    {
        url:            { type: String, required: true      },
        height:         { type: String, default: '400px'    },
		width:          { type: String, default: '600px'    },
        initialWait:    { type: Number, default: 1000       },
        wait:           { type: Number, default: 2000       },
        duration:       { type: Number, default: 15000      },
        zoom1:          { type: String, default: '100%'     },  
        zoom2:          { type: String, default: '250%'     },
        position1:      { type: String, default: 'center'   },  
        position2:      { type: String, default: '80% 50%'  }          
    })

    const panZoomRef            = ref(null)
    const liveAnimation      = ref(null)
    const phaseLabel         = ref('ZoomOut')
    const playbackState      = computed(() => play.value ? 'running' : 'paused')
    const cycleDuration      = computed(() => (props.duration + props.wait) * 2)

    let startTimerId         = null
    let phaseTimerId         = null

    const animation          = computed(() =>
    ({ 
        backgroundImage:        `url('${props.url}')`,
        height:                 props.height,
        width:                  props.width,
        backgroundSize:         props.zoom1,
		backgroundPosition:     props.position1
    }))

    const stopPhaseTimer     = () =>
    {
        if (phaseTimerId !== null)
        {
            window.clearInterval(phaseTimerId)
            phaseTimerId = null
        }
    }

    const updatePhaseLabel   = () =>
    {
        if (!liveAnimation.value)
        {
            phaseLabel.value = 'ZoomOut'
            return
        }

        const currentTime = Number(liveAnimation.value.currentTime ?? 0)
        const cycleTime   = cycleDuration.value
        const halfCycle   = props.duration + props.wait

        if (cycleTime === 0)
        {
            phaseLabel.value = 'ZoomOut'
            return
        }

        phaseLabel.value = currentTime % cycleTime < halfCycle ? 'ZoomIn' : 'ZoomOut'
    }

    const startPhaseTimer    = () =>
    {
        stopPhaseTimer()
        updatePhaseLabel()
        phaseTimerId = window.setInterval(updatePhaseLabel, 200)
    }

    const destroyAnimation   = () =>
    {
        stopPhaseTimer()

        if (startTimerId !== null)
        {
            window.clearTimeout(startTimerId)
            startTimerId = null
        }

        if (liveAnimation.value)
        {
            liveAnimation.value.cancel()
            liveAnimation.value = null
        }

        phaseLabel.value = 'ZoomOut'
    }

    const createAnimation    = () =>
    {
        if (!panZoomRef.value) return

        const totalCycle = cycleDuration.value

        liveAnimation.value = panZoomRef.value.animate(
        [
            { backgroundSize: props.zoom1, backgroundPosition: props.position1, offset: 0 },
            { backgroundSize: props.zoom2, backgroundPosition: props.position2, offset: props.duration / totalCycle },
            { backgroundSize: props.zoom2, backgroundPosition: props.position2, offset: (props.duration + props.wait) / totalCycle },
            { backgroundSize: props.zoom1, backgroundPosition: props.position1, offset: (2 * props.duration + props.wait) / totalCycle },
            { backgroundSize: props.zoom1, backgroundPosition: props.position1, offset: 1 }
        ],
        {
            duration:    totalCycle,
            iterations:  Infinity,
            easing:      'linear',
            fill:        'both'
        })

        if (!play.value)
            liveAnimation.value.pause()

        startPhaseTimer()
    }

    const restartAnimation   = () =>
    {
        destroyAnimation()
        startTimerId = window.setTimeout(createAnimation, props.initialWait)
    }

	watch(play, isPlaying =>
	{
		if (!liveAnimation.value)
			return

		if (isPlaying)
			liveAnimation.value.play()
		else
			liveAnimation.value.pause()

		updatePhaseLabel()
	})

	watch ( () => 
    [
            props.url, 
            props.height, 
            props.width, 
            props.initialWait, 
            props.wait, 
            props.duration, 
            props.zoom1, 
            props.zoom2, 
            props.position1, 
            props.position2
    ],
		restartAnimation
	)

	onMounted(restartAnimation)
	onBeforeUnmount(destroyAnimation)

</script>

<template>

	<div ref="panZoomRef" class="bg-no-repeat text-white relative" 
        :style="animation">
        <slot :phaseLabel :playbackState />      
	</div>

</template>
