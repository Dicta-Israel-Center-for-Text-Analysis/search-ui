jTextMinerApp.component('chunkBar',
{
    bindings: {
        chunks: '<'
    },
    templateUrl: 'Components/Shared/chunkBar.component.html',
    controller: [
        function() {
            const ctrl = this;

            ctrl.calculateChunkHeight = function (chunk) {
                const total = _.sumBy(ctrl.chunks, chunk => chunk.text.length);
                // doesn't recalculate on resize
                const viewHeight = document.documentElement.clientHeight;
                // after removing the minimum size of each bar, how much extra space is there to allocate?
                const extraHeight = viewHeight - 1 - ctrl.chunks.length*9;
                // this chunk should be extraHeight times its percentage of the text, plus a minimum 7 pixels,
                // with an additional 3px for spacing between bars
                // converted to vh units so that it will scale reasonably
                return (extraHeight * (chunk.text.length / total) + 6)*100/viewHeight;
            };

            // ctrl.createThumbnail = function (chunk) {
            //    return _.repeat('\u3030\u200b', chunk.text.length / 200);
            // };

            ctrl.scrollTo = function (index) {
                window.scrollTo(0, $("#section" + index).offset().top);
            };

        }]
}); 