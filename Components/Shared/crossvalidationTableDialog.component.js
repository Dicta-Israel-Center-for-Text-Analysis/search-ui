jTextMinerApp.component('crossvalidationTableDialog', {
    bindings: {
        crossvalidationResults: '=',
        onConfirm: '&'
    },
    templateUrl: 'Components/Shared/crossvalidationTableDialog.component.html',
    controller: function () {
        const ctrl = this;

        // the inclusion of the following code is a hack to compensate for problems in sorting class names
        // that might have numbers in the name

        /* From alphanum.js (C) Brian Huisman
         * Based on the Alphanum Algorithm by David Koelle
         * The Alphanum Algorithm is discussed at http://www.DaveKoelle.com
         *
         * Distributed under same license as original
         *
         * This library is free software; you can redistribute it and/or
         * modify it under the terms of the GNU Lesser General Public
         * License as published by the Free Software Foundation; either
         * version 2.1 of the License, or any later version.
         *
         * This library is distributed in the hope that it will be useful,
         * but WITHOUT ANY WARRANTY; without even the implied warranty of
         * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
         * Lesser General Public License for more details.
         *
         * You should have received a copy of the GNU Lesser General Public
         * License along with this library; if not, write to the Free Software
         * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
         */
        function alphanum(a, b) {
            function chunkify(t) {
                var tz = new Array();
                var x = 0, y = -1, n = 0, i, j;

                while (i = (j = t.charAt(x++)).charCodeAt(0)) {
                    var m = (i == 46 || (i >= 48 && i <= 57));
                    if (m !== n) {
                        tz[++y] = "";
                        n = m;
                    }
                    tz[y] += j;
                }
                return tz;
            }

            var aa = chunkify(a);
            var bb = chunkify(b);

            for (x = 0; aa[x] && bb[x]; x++) {
                if (aa[x] !== bb[x]) {
                    var c = Number(aa[x]), d = Number(bb[x]);
                    if (c == aa[x] && d == bb[x]) {
                        return c - d;
                    } else return (aa[x] > bb[x]) ? 1 : -1;
                }
            }
            return aa.length - bb.length;
        }

        ctrl.sortedFilteredList = ctrl.crossvalidationResults.classificationList.sort((a, b) => alphanum(a.filename, b.filename))
            .filter(chunk => chunk.className != chunk.realClassName);

        ctrl.removePrefix = function (filename) {
            return filename.replace(/\/Dicta Corpus\//,'');
        }
    }
});