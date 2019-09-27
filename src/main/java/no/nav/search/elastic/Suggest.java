package no.nav.search.elastic;

import org.elasticsearch.client.Client;
import org.elasticsearch.client.transport.TransportClient;
// import org.elasticsearch.search.suggest.Suggest;
import org.elasticsearch.search.suggest.Suggest.Suggestion;
import org.elasticsearch.search.suggest.Suggest.Suggestion.Entry;
import org.elasticsearch.search.suggest.Suggest.Suggestion.Entry.Option;
import org.elasticsearch.action.suggest.SuggestRequest;
import org.elasticsearch.search.suggest.term.TermSuggestionBuilder;
import org.elasticsearch.search.suggest.SuggestBuilder;
import org.elasticsearch.search.suggest.SuggestBuilders;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import java.util.Collection;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// DOCUMENTATION http://javadoc.kyubu.de/elasticsearch/v1.7.3/

@Component(immediate = true)
public class Suggest {
    private final static Logger LOG = LoggerFactory.getLogger( Suggest.class );

    private List<String> texts;

    public void setTexts(List<String> texts) {
        this.texts = texts;
    }

    public List<String> getTexts() {
        return this.texts;
    }

    public List<String> suggest() {
        SuggestBuilder suggestBuild = new SuggestBuilder();
        for(String text : this.texts) {
            TermSuggestionBuilder termSuggestionBuilder = SuggestBuilders.termSuggestion(text)
            .text(text)
            .field("_alltext._analyzed")
            .suggestMode("always");
            suggestBuild = suggestBuild.addSuggestion(termSuggestionBuilder);
        }
        SuggestRequest request = new SuggestRequest().suggest(suggestBuild);
        org.elasticsearch.search.suggest.Suggest suggest = ClientHolder.client
            .suggest(request)
            .actionGet()
            .getSuggest();
        LOG.info(Integer.toString(suggest.size()));
        List<String> suggestions = new ArrayList<String>();
        for(String text: this.texts) {
            Suggestion s = suggest.getSuggestion(text);
            List<Entry> entries = s.getEntries();
            for(Entry entry : entries) {
                List<Option> options = entry.getOptions();
                for(Option option: options) {
                    suggestions.add(option.getText().string());
                }
            }
        }
        return suggestions;
    }

    @Component(immediate = true)
    public static class ClientHolder {
        public static Client client;
    
        @Reference
        public void setClient( final Client client )
        {
            this.client = client;
        }
    }
}
