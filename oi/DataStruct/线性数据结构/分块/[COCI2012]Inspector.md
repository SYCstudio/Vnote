# [COCI2012]Inspector
[BZOJ3463]

在一个小国家中，一个新的小镇终于建成了！如往常一样，Mirko获得了“首席税务巡查员”的职位。他的任务是保证正确地计算各公司的收入情况。一共有N家办公室坐落在主干道上，从左到右被编号为1~N。一开始，所有办公室一开始都是空的。随后，一些公司会搬入或搬出某些办公室。Mirko时不时地会经过某些办公室并审查在这些办公室中，最富有的公司的账目。  
一个公司被以如下的方式描述：  
T-表示搬入的第一天。  
K-表示搬入的办公室的标号。  
Z-公司每日的盈利。（可以是负值表示亏损）  
S-公司搬入时的公司财务情况。（即公司的账户资金，也可以是负值）  
如果一家公司已经在 K 办公室了，当有新公司要进入 K 办公室时，这家公司会立刻搬出。  
新公司第一天并不会运营，盈利从第二天开始计算。  
Mirko的审查以 3 个整数来描述：  
T-审查的时间。  
A 和 B-Mirko会检查 A 办公室至 B 办公室（包括A和B）之间的公司。  
Mirko只会在一天结束时检查，所有公司这时已经计算完成了当天利润。

注意到每一个公司的盈亏状况是一个一次函数，而一次函数的性质就是如果在某一次它不是最优值了，它之后也不可能成为最优值。  
考虑分块，对于每一块维护所有一次函数的下凸包，由于询问时间是单调的，所以可以用一个单调队列来维护。查询的时候对于整块直接查队首，对于零散的直接求值；修改的时候暴力重构所在的块。

```cpp
#include<cstdio>
#include<cstdlib>
#include<algorithm>
#include<queue>
#include<iostream>
#include<cstring>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define mp make_pair
#define ft first
#define sd second

namespace IO{
    const int maxn((1 << 21) + 1);

    char ibuf[maxn], *iS, *iT, obuf[maxn], *oS = obuf, *oT = obuf + maxn - 1, c, st[55];
    int f, tp;
    char Getc() {
        return (iS == iT ? (iT = (iS = ibuf) + fread(ibuf, 1, maxn, stdin), (iS == iT ? EOF : *iS++)) : *iS++);
    }

    void Flush() {
        fwrite(obuf, 1, oS - obuf, stdout);
        oS = obuf;
    }

    void Putc(char x) {
        *oS++ = x;
        if (oS == oT) Flush();
    }
    
    template <class Int> void Input(Int &x) {
        for (f = 1, c = Getc(); c < '0' || c > '9'; c = Getc()) f = c == '-' ? -1 : 1;
        for (x = 0; c <= '9' && c >= '0'; c = Getc()) x = (x << 3) + (x << 1) + (c ^ 48);
        x *= f;
    }
    
    template <class Int> void Print(Int x) {
        if (!x) Putc('0');
        if (x < 0) Putc('-'), x = -x;
        while (x) st[++tp] = x % 10 + '0', x /= 10;
        while (tp) Putc(st[tp--]);
    }

    void Getstr(char *s, int &l) {
        for (c = Getc(); c < 'a' || c > 'z'; c = Getc());
        for (l = 0; c <= 'z' && c >= 'a'; c = Getc()) s[l++] = c;
        s[l] = 0;
    }
    
    void Putstr(const char *s) {
        for (int i = 0, n = strlen(s); i < n; ++i) Putc(s[i]);
    }
}

using namespace IO;

const int maxN=101000;
const int Block=110;
const ll INF=1e18;

ld GetC(ll k1,ll b1,ll k2,ll b2);

class Convex{
public:
    int sz;
    deque<pair<ll,ll> > C;
    Convex(){
	sz=-1;return;
    }
    void clear(){
	sz=-1;C.clear();return;
    }
    void push_back(ll k,ll b){
	while (sz>=0){
	    if (C[sz].ft==k){
		if (C[sz].sd>=b) return;
		C.pop_back();--sz;continue;
	    }
	    else if (sz>=1&&GetC(C[sz-1].ft,C[sz-1].sd,k,b)<=GetC(C[sz-1].ft,C[sz-1].sd,C[sz].ft,C[sz].sd)){
		C.pop_back();--sz;continue;
	    }
	    break;
	}
	C.push_back(mp(k,b));++sz;return;
    }
    bool empty(){
	return sz==-1;
    }
    ll top(ll t){
	if (empty()) return -INF;
	while (sz>=1&&GetC(C[0].ft,C[0].sd,C[1].ft,C[1].sd)<=t) C.pop_front(),--sz;
	return t*C[0].ft+C[0].sd;
    }
};

int n,m;
int L[maxN],R[maxN],Bl[maxN];
bool nrb[maxN];
ll K[maxN],B[maxN];
pair<ll,ll> Sorter[maxN];
Convex Cnx[1000],Bp;

void rebuild(int id);

int main(){
    Input(n);Input(m);
    for (int i=1;i<=n;i++){
	Bl[i]=i/Block+1;R[Bl[i]]=i;
	if (L[Bl[i]]==0) L[Bl[i]]=i;
    }
    for (int i=1;i<=n;i++) K[i]=0,B[i]=-INF;
    while (m--){
	int opt;Input(opt);
	if (opt==1){
	    ll t,p,k,b;
	    Input(t);Input(p);Input(k);Input(b);
	    K[p]=k;B[p]=b-k*t;
	    nrb[Bl[p]]=1;
	}
	if (opt==2){
	    int t,l,r;
	    Input(t);Input(l);Input(r);
	    ll Ans=-INF;if (l>r) swap(l,r);
	    if (Bl[l]==Bl[r]) for (int i=l;i<=r;i++) Ans=max(Ans,K[i]*t+B[i]);
	    else{
		for (int i=l;i<=R[Bl[l]];i++) Ans=max(Ans,K[i]*t+B[i]);
		for (int i=L[Bl[r]];i<=r;i++) Ans=max(Ans,K[i]*t+B[i]);
		for (int i=Bl[l]+1;i<Bl[r];i++) if (nrb[i]) rebuild(i);
		for (int i=Bl[l]+1;i<Bl[r];i++) Ans=max(Ans,Cnx[i].top(t));
	    }
	    if (Ans==-INF) Putstr("nema\n");
	    else Print(Ans),Putc('\n');
	}
    }
    Flush();
    return 0;
}

ld GetC(ll k1,ll b1,ll k2,ll b2){
    return (ld)(b1-b2)/(ld)(k2-k1);
}
int Input(){
    char ch=getchar();int x=0,k=1;
    while (!isdigit(ch)&&(ch!='-')) ch=getchar();
    if (ch=='-') k=-1,ch=getchar();
    while (isdigit(ch)) x=x*10+ch-48,ch=getchar();
    return x*k;
}
void rebuild(int id){
    int scnt=0;for (int i=L[id];i<=R[id];i++) if (B[i]!=-INF) Sorter[++scnt]=mp(K[i],B[i]);
    sort(&Sorter[1],&Sorter[scnt+1]);
    Cnx[id].clear();
    for (int i=1;i<=scnt;i++) Cnx[id].push_back(Sorter[i].ft,Sorter[i].sd);
    nrb[id]=0;return;
}
```