# [CTSC2006]歌唱王国Singleland
[BZOJ1152 Luogu4548]

在歌唱王国，所有人的名字都是一个非空的仅包含整数 $ 1-n  $ 的字符串。  
王国里生活着一大群咕噜兵，他们靠不停的歌唱首领——牛人酋长们的名字来获取力量。  
咕噜兵每一次歌唱过程是这样的：  
首先，他从整数生成器那儿获得一个数字，然后花一个时间单位将此数字唱出来，  
如果他发现某个牛人酋长的名字已经被歌唱出来（即此名字是歌唱序列的一个连续子串），  
那么这次歌唱过程就立即结束。

相关名词定义：
歌唱序列：如果某人歌唱了  $ x  $ 个数字，第  $ i  $ 次歌唱的数字为  $ a_i $ ，那么歌唱序列 $ =(a_1,a_2,…,a_x) $ 。  
整数生成器：歌唱王国的神物，它有一个按钮，如果你按一下按钮，将从  $ 1-n  $ 数字中等概率的随机返回一个整数。  
歌唱时间：在一次歌唱过程中花费的时间。  

歌唱时间是随机的，无法预料；  
不过歌唱时间的期望值是固定的，此期望值即平均来说歌唱时间有多长，亦可称作平均歌唱时间。   

王国里的人非常喜欢歌唱，他们希望歌唱的时间越长越好，所以他们决定罢免一些牛人酋长，  
 使得平均歌唱时间变长。 但是他们不能罢免掉所有的牛人酋长，否则他们每次歌唱都无法停止，无法获取力量；  
于是他们决定只保留一个牛人酋长而罢免其余的牛人酋长。  

你的任务是：对于给定的 $ n $ 、牛人酋长的个数  $ t $  以及每一个牛人酋长的名字，  
告诉王国里的人们，对于  $ 1≤i≤t $ ，如果保留第  $ i  $ 个牛人酋长，罢免掉其余的，那么平均歌唱时间将是多少。  
提示：此数为一个非负整数！  
输出要求：由于这个数字太大，所以你只需输出这个数的末 $ 4  $ 位数字。如果不足  $ 4  $ 位，则前面补  $ 0 $ (见样例)。  


比较巧妙的构造。

对于每一个酋长分开处理。接下来，$c$表示一个数字字符，其它小写字母表示一个数字字符串，大写字母表示一个数字字符串集合。

设$s$表示当前处理的字符串，$P= \lbrace a|a为s后缀且a\neq""且a \neq s且在s中去掉a后的字符串既是s的前缀又是s的后缀 \rbrace$，$Y$为结尾为$s$且只出现一次$s$的字符串集合，$N$表示不包含$s$作为子串的字符串集合，$|a|$表示字符串$a$的长度。  
根据定义，可以得到两个方程。

$$ \lbrace 空串 \rbrace \bigcup \lbrace a|a=p+c,c \in [1,n],p \in N \rbrace=N \bigcup Y \\\\ \lbrace a|a=p+s,p \in N \rbrace = Y \bigcup \lbrace a|a=q+p,q \in Y ,p \in P\rbrace$$

第一个方程的意思是，对于每一个原本不包含$s$作为子串的字符串，在它的后面增加一个数字，会有两种情况，即要么依然不包含$s$作为子串，要么包含且仅包含一个。  
第二个方程的意思是，对于每一个原本不包含$s$作为子串的字符串，在它的后面增加字符串$s$，还是有两种情况，一种是只包含一个$s$，另一种是包含两个$s$且这两个$s$重叠，既然重叠那么就可以用集合$Y$加上一个$P$中的元素来构造。

同时，我们也可以用$Y$得到答案的表达式：$Ans=\sum _ {a \in Y} \frac{|a|}{n^{|a|}}$。设$F(A)=\sum _ {a \in A} \frac{|a|}{n^{|a|}}$  
但是直接求$F$并不好求，根据**概率母函数**的定义，我们设$G(A,z)=\sum _ {a \in A} (\frac{z}{|a|})^{|a|}$，$G(A,z)$对$z$求导得到$G'(A,z)=\sum _ {a \in A} (\frac{1}{n})^{|a|}|a|z^{|a|-1}$，即$F(Y)=G'(Y,1)$。  
那么现在的问题就是要求出$G(Y,1)$，然后通过求导得到$F(Y)$。把上面列出的两个关于数字串集合的方程带入到函数$G$中，得到。

$$G(\lbrace 空串 \rbrace \bigcup \lbrace a|a=p+c,c \in [1,n],p \in N \rbrace,z)=G(N \bigcup Y,z) \\\\ G(\lbrace a|a=p+s,p \in N \rbrace,z)=G(Y \bigcup \lbrace a|a=q+p,q \in Y ,p \in P\rbrace)$$

如何化简这个式子呢，考虑其中用到的关于函数$G(A,z)$的运算符，有$G(A+B,z)$和$G(\lbrace a|a=p+k,p \in A,k为一字符串 \rbrace,z)$两种运算。根据定义，可以得到  
$$G(A+B,z)=G(A,z)+G(B,z) \\\\ G(\lbrace a|a=p+k,p \in A,k为一字符串 \rbrace,z)=G(A,z) \times (\frac{z}{n})^{|k|}$$

然后我们就可以把上面的方程化简了，得到  
$$1+z \times G(N,z)=G(N,z)+G(Y,z) \\\\ G(N,z) \times (\frac{z}{n})^{|s|}=G(Y,z)+G(Y,z) \times G(P,z)$$

其中$G(P,z)$为常量（因为集合$P$是确定的），$G(N,z)$和$G(Y,z)$是未知量，考虑到我们需要求的是$G(Y,z)$，所以大力解方程，消去$G(N,z)$，得到$G(Y,z)$的表达式。  

$$G(Y,z)=\frac{(\frac{z}{n})^{|s|}}{(\frac{z}{n})^{|s|}+G(P,z)-z \times G(P,z)+1-z}$$

把$G(P,z)$按照定义展开，得到  
$$G(Y,z)=\frac{(\frac{z}{n})^{|s|}}{(\frac{z}{n})^{|s|}+\sum _ {a \in P}\frac{1}{n^{|a|}} z^{|a|} - z \times \sum _ {a \in P}\frac{1}{n^{|a|}} z^{|a|} +1 -z  } \\\\ =\frac{(\frac{z}{n})^{|s|}}{(\frac{z}{n})^{|s|}+\sum _ {a \in P}\frac{1}{n^{|a|}} z^{|a|} - \sum _ {a \in P}\frac{1}{n^{|a|}} z^{|a|+1} +1 -z  }$$

设$h(z)$为分子，$p(z)$为分母。  
$$h(z)=(\frac{z}{n})^{|s|} \\\\ p(z)=(\frac{z}{n})^{|s|}+\sum _ {a \in P}\frac{1}{n^{|a|}} z^{|a|} - \sum _ {a \in P}\frac{1}{n^{|a|}} z^{|a|+1} +1 -z  $$  

分别求导得到  
$$h'(z) =\frac{|s|z^{|s|-1}}{n^{|s|}} \\\\ p'(z) =\frac{z^{|s|}}{n^{|s|}}+\sum _ {a \in P} \frac{|a|z^{|a|-1}}{n^{|a|}}-\sum _ {a \in P} \frac{(|a|+1)z^{|a|}}{n^{|a|}}+0-1$$

将$z=1$带入，得到  
$$h(1)=p(1)=\frac{1}{n^{|s|}} \\\\ h'(1)=\frac{|s|}{n^{|s|}} \\\\ p'(1)=\frac{|s|}{n^{|s|}}+\sum _ {a \in P} \frac{|a|}{n^{|a|}}-\sum _ {a \in P}\frac{|a|+1}{n^{|a|}}-1 \\\\ $$

根据导数除法的性质，$G'(Y,1)=\frac{h'(1)p(1)-p'(1)h(1)}{p^2(1)}$，得到  
$$G'(Y,1)=\frac{\frac{|s|}{n^{|s|}}\times \frac{1}{n^{|s|}}-\frac{1}{n^{|s|}}(\frac{|s|}{n^{|s|}}-\sum _ {a \in P} \frac{1}{n^{|a|}} -1)  }  {  \frac{1}{n^{2|s|}}  } \\\\ =\sum _ {a \in P}n^{|s|-|a|}+n^{|s|}$$

那么$|s|-|a|$的意义是什么呢？就是所有相同的前后缀的长度，那么用$KMP$统计一遍就好。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int Mod=10000;
const int inf=2147483647;

int n,m;
int Arr[maxN],Next[maxN];
ll Pow[maxN];

int main()
{
	scanf("%d%d",&n,&m);
	Pow[0]=1;for (int i=1;i<maxN;i++) Pow[i]=Pow[i-1]*n%Mod;
	while (m--)
	{
		int len;scanf("%d",&len);
		for (int i=1;i<=len;i++) scanf("%d",&Arr[i]);
		Next[0]=Next[1]=0;
		for (int i=2,j=0;i<=len;i++)
		{
			while ((j!=0)&&(Arr[i]!=Arr[j+1])) j=Next[j];
			if (Arr[i]==Arr[j+1]) j++;
			Next[i]=j;
		}
		//for (int i=1;i<=len;i++) cout<<Next[i]<<" ";cout<<endl;
		ll Ans=0;
		for (int i=len;i!=0;i=Next[i]) Ans=(Ans+Pow[i])%Mod;
		printf("%04lld\n",Ans);
	}
	return 0;
}
```